import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Db } from "mongodb";
import { createClient } from "redis";

const commandData = new SlashCommandBuilder()
  .setName("quote")
  .setDescription("Save a quote out of context!")
  .addStringOption((option) => option.setName("quote").setDescription("The quote you want to save").setRequired(true))
  .addStringOption((option) => option.setName("author").setDescription("The author of the quote").setRequired(true))
  .toJSON();

const handleInteraction = async (interaction: CommandInteraction, database: Db, redisClient: ReturnType<typeof createClient>) => {
  try {
    const guildId = interaction.guildId as string;
    const collection = database.collection(guildId);

    const quoteObj = {
      quote: interaction.options.get("quote")?.value as string,
      author: interaction.options.get("author")?.value as string,
      createDate: Date.now(),
    };

    await collection.insertOne(quoteObj);

    const embedReply = new EmbedBuilder().setColor("#d78ee4").setTitle("Successfully added your quote!").setDescription(`"${quoteObj.quote}" - ${quoteObj.author}`).setTimestamp();

    await interaction.reply({ embeds: [embedReply] });
  } catch (err) {
    console.error(err);
    interaction.reply("There was an error saving your quote. Please try again or contact an admin");
  }
};

export { commandData, handleInteraction };
