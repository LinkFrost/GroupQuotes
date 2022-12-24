import * as dotenv from "dotenv";
dotenv.config();
import { ChannelType, Client, EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import { MongoClient } from "mongodb";

const TOKEN = process.env.BOT_TOKEN;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

if (!TOKEN || !MONGO_USER || !MONGO_PASSWORD) {
  console.log("Error, one or more environment variables missing!");
}

const mongo_uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ddfnf.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(mongo_uri);
const database = mongoClient.db("GroupQuotes");

const discordClient = new Client({ intents: ["Guilds"] });
discordClient.login(TOKEN);

// Upon joining a new server, check if a collection for it exists in the db. If not, create one
discordClient.on("guildCreate", async (guild) => {
  try {
    const channel = guild.channels.cache.find((channel) => {
      if (channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me as GuildMember).has("SendMessages") && channel.id === guild.systemChannelId) {
        return channel;
      }
    }) as TextChannel;

    if (channel !== undefined) {
      const introMessage = new EmbedBuilder().setColor("#d78ee4").setTitle("Hello there!").setDescription(`Welcome to GroupQuotes!`).addFields({ name: "**How to use**", value: "Type / to see a list of commands for the bot!" });

      channel.send({ embeds: [introMessage] });
    }

    const guildId = guild.id;
    const checkCollection = (await database.listCollections().toArray()).map((c) => c.name).filter((c) => c === guildId);

    if (checkCollection.length === 0) {
      database.createCollection(guildId);
    }
  } catch (err) {
    console.error("Error on joining server: ", err);
  }
});
