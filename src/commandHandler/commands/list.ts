import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, TextChannel, ChannelType } from "discord.js";
import { Db } from "mongodb";
import { createClient } from "redis";
import { Pagination } from "discordjs-button-embed-pagination";

const commandData = new SlashCommandBuilder()
  .setName("list")
  .setDescription("List all quotes in this server or filter by author.")
  .addStringOption((option) => option.setName("author").setDescription("Filter quotes by author").setRequired(false))
  .toJSON();

const handleInteraction = async (interaction: CommandInteraction, database: Db, redisClient: ReturnType<typeof createClient>) => {
  try {
    const guildId = interaction.guildId as string;
    const collection = database.collection(guildId);
    const author = interaction.options.get("author")?.value;

    // const quotes = author === undefined ? await collection.find().sort("createDate").toArray() : await collection.find({author: author}).sort("createDate").toArray()

    await interaction.reply("Testing");
  } catch (err) {
    console.error(err);
    interaction.reply("There was an error listing the quotes. Please try again or contact an admin");
  }
};

export { commandData, handleInteraction };
