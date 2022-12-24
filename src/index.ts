import * as dotenv from "dotenv";
dotenv.config();
import { ChannelType, Client, EmbedBuilder, GuildMember, REST, TextChannel } from "discord.js";
import { MongoClient } from "mongodb";
import { handleInteraction, registerCommands } from "./commandHandler/commandHandler";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const APPLICATION_ID = process.env.APPLICATION_ID!;
const MONGO_USER = process.env.MONGO_USER!;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD!;

if (!BOT_TOKEN || !MONGO_USER || !MONGO_PASSWORD || !APPLICATION_ID) {
  console.log("Error, one or more environment variables missing!");
}

const mongo_uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ddfnf.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(mongo_uri);
const database = mongoClient.db("GroupQuotes");

const discordClient = new Client({ intents: ["Guilds"] });
discordClient.login(BOT_TOKEN);

const discordRest = new REST({ version: "10" }).setToken(BOT_TOKEN);

// Upon joining a new server, check if a collection for it exists in the db. If not, create one
discordClient.on("guildCreate", async (guild) => {
  const guildId = guild.id;

  console.log(`Joined server with guild id ${guildId}`);

  try {
    const channel = guild.channels.cache.find((channel) => {
      if (channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me as GuildMember).has("SendMessages") && channel.id === guild.systemChannelId) {
        return channel;
      }
    }) as TextChannel;

    if (channel === undefined) {
      throw new Error();
    }

    const introMessage = new EmbedBuilder().setColor("#d78ee4").setTitle("Hello there!").setDescription(`Welcome to GroupQuotes!`).addFields({ name: "**How to use**", value: "Type / to see a list of commands for the bot!" });

    channel.send({ embeds: [introMessage] });

    const checkCollection = (await database.listCollections().toArray()).map((c) => c.name).filter((c) => c === guildId);

    if (checkCollection.length === 0) {
      database.createCollection(guildId);
    }
  } catch (err) {
    console.error("Error on joining server or MongoDB collection creation: ", err);
  }
});

discordClient.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  handleInteraction(interaction);
});

discordClient.on("ready", async () => {
  try {
    await registerCommands(discordRest, APPLICATION_ID);
  } catch (err) {
    console.error(err);
  }
});
