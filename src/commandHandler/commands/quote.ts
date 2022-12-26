import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, TextChannel, ChannelType, range, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { Db } from "mongodb";
import { createClient } from "redis";

const singleQuote = new SlashCommandSubcommandBuilder()
  .setName("one")
  .setDescription("Save a single quote")
  .addStringOption((option) => option.setName("quote").setDescription("The quote you want to save").setRequired(true))
  .addStringOption((option) => option.setName("author").setDescription("The author of the quote").setRequired(true));
const subCommands = new SlashCommandSubcommandGroupBuilder().setName("convo").setDescription("Save up to five quotes for a conversation");

for (let i = 0; i < 5; i++) {
  // quoteStr =
  subCommands.addSubcommand((subCommand) =>
    subCommand
      .setName("quote-" + String(i + 1))
      .setDescription("Quote in the conversation")
      .addStringOption((option) =>
        option
          .setName("quote-" + String(i + 1))
          .setDescription("The quote you want to save")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("author-" + String(i + 1))
          .setDescription("The author of the quote")
          .setRequired(true)
      )
  );
}

const commandData = new SlashCommandBuilder()
  .setName("quote")
  .setDescription("Save a quote out of context!")
  .addSubcommand(singleQuote)
  .addSubcommandGroup(subCommands)
  // .addStringOption((option) => option.setName("quote").setDescription("The quote you want to save").setRequired(true))
  // .addStringOption((option) => option.setName("author").setDescription("The author of the quote").setRequired(true))
  .toJSON();

// .addSubcommand(subCommand => subCommand.setName(`quote-1`).setDescription("First quote in the conversation")
// .addStringOption((option) => option.setName("quote-1").setDescription("The quote you want to save").setRequired(true))
// .addStringOption((option) => option.setName("author-1").setDescription("The author of the quote").setRequired(true)));

// for(let i = 1; i < 5; i++) {
//   commandData.addSubcommand(subCommand => subCommand.setName(`quote-${i+1}`).setDescription("Additional quote in the conversation").addStringOption((option) => option.setName(`quote-${i+1}`).setDescription("The quote you want to save").setRequired(true))
//   .addStringOption((option) => option.setName(`author-${i+1}`).setDescription("The author of the quote").setRequired(true)))
// }

// commandData = commandData.toJSON()

const handleInteraction = async (interaction: CommandInteraction, database: Db, redisClient: ReturnType<typeof createClient>) => {
  try {
    // const guildId = interaction.guildId as string;
    // const collection = database.collection(guildId);

    // const quoteObj = {
    //   quote: interaction.options.get("quote")?.value as string,
    //   author: interaction.options.get("author")?.value as string,
    //   createDate: Date.now(),
    // };

    await interaction.reply("Testing");

    // await collection.insertOne(quoteObj);

    // const embedReply = new EmbedBuilder().setColor("#d78ee4").setTitle("Successfully added your quote!").setDescription(`"${quoteObj.quote}" - ${quoteObj.author}`).setTimestamp(quoteObj.createDate);

    // await interaction.reply({ embeds: [embedReply] });

    // const galleryChannelId = await redisClient.get(guildId);

    // if (galleryChannelId !== null) {
    //   const channel = interaction.client.channels.cache.find((channel) => {
    //     if (channel.id === galleryChannelId && channel.type === ChannelType.GuildText) return channel.id;
    //   }) as TextChannel;

    //   const embedGalleryQuote = new EmbedBuilder().setColor("#d78ee4").setTitle(`"${quoteObj.quote}"`).setDescription(`- ${quoteObj.author}`).setTimestamp(quoteObj.createDate);

    //   await channel.send({ embeds: [embedGalleryQuote] });
    // }
  } catch (err) {
    console.error(err);
    interaction.reply("There was an error saving your quote. Please try again or contact an admin");
  }
};

export { commandData, handleInteraction };
