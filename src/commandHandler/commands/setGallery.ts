import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction, ButtonInteraction } from "discord.js";
import { Db } from "mongodb";
import { createClient } from "redis";

const commandData = new SlashCommandBuilder()
  .setName("set-gallery")
  .setDescription("Set the channel where quotes will be sent")
  .addChannelOption((option) => option.setName("gallery-channel").setDescription("The channel where new quotes will be displayed").setRequired(true))
  .toJSON();

const handleInteraction = async (interaction: CommandInteraction, database: Db, redisClient: ReturnType<typeof createClient>) => {
  try {
    const guildId = interaction.guildId as string;
    const collection = database.collection(guildId);
    const galleryChannelId = interaction.options.get("gallery-channel")?.value as string;

    await redisClient.set(guildId, galleryChannelId);

    const embedReply = new EmbedBuilder().setColor("#d78ee4").setTitle("Gallery Channel Set").setDescription(`New quotes will be sent to <#${galleryChannelId}> This can be changed later with the same command.`).setTimestamp();

    await interaction.reply({ embeds: [embedReply] });

    const quotes = await collection.find().sort("createDate").toArray();

    if (quotes.length > 0) {
      const askEmbedMessage = new EmbedBuilder().setColor("#d78ee4").setTitle("Existing quotes found").setDescription("We found that this server has some existing quotes attached to it already. Would you like to send those over to this gallery channel?");

      const askActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("set-gallery yes " + galleryChannelId)
          .setLabel("Yes")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("set-gallery no " + galleryChannelId)
          .setLabel("No")
          .setStyle(ButtonStyle.Secondary)
      );

      await interaction.channel?.send({ embeds: [askEmbedMessage], components: [askActionRow] });
    } else {
      const embedReply = new EmbedBuilder().setColor("#d78ee4").setTitle("Gallery Channel Set").setDescription(`New quotes will be sent to <#${galleryChannelId}> This can be changed later with the same command.`).setTimestamp();
      await interaction.reply({ embeds: [embedReply] });
    }
  } catch (err) {
    console.error(err);
    interaction.reply("There was an error in setting the gallery channel. Please try again or contact an admin");
  }
};

const handleButton = async (interaction: ButtonInteraction, database: Db, redisClient: ReturnType<typeof createClient>) => {
  const guildId = interaction.guildId as string;
  const collection = database.collection(guildId);
  const idParams = interaction.customId.split(" ");
  const buttonType = idParams[1];
  const galleryChannelId = idParams[2];

  if (buttonType === "yes") {
    try {
      const quotes = await collection.find().sort("createDate").toArray();

      const channel = interaction.client.channels.cache.find((channel) => {
        if (channel.id === galleryChannelId && channel.type === ChannelType.GuildText) return channel.id;
      }) as TextChannel;

      for (const quote of quotes) {
        const embedGalleryQuote = new EmbedBuilder().setColor("#d78ee4").setTitle(`"${quote.quote}"`).setDescription(`- ${quote.author}`).setTimestamp(quote.createDate);

        setTimeout(async () => {
          await channel.send({ embeds: [embedGalleryQuote] });
        }, 500);
      }

      const updatedEmbedMessage = new EmbedBuilder().setColor("#d78ee4").setTitle("Success").setDescription(`Existing quotes have been sent in <#${galleryChannelId}>`);

      const updatedActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("set-gallery yes " + galleryChannelId)
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("set-gallery no " + galleryChannelId)
          .setLabel("No")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      );

      interaction.update({ embeds: [updatedEmbedMessage], components: [updatedActionRow] });
    } catch (err) {
      const updatedEmbedMessage = new EmbedBuilder().setColor("#d78ee4").setTitle("Error").setDescription("There was an error sending your quotes. Please try again or contact an admin.");

      const updatedActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("set-gallery yes " + galleryChannelId)
          .setLabel("Yes")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("set-gallery no " + galleryChannelId)
          .setLabel("No")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      );

      interaction.update({ embeds: [updatedEmbedMessage], components: [updatedActionRow] });

      console.error(err);
    }
  }

  if (buttonType === "no") {
    const updatedEmbedMessage = new EmbedBuilder().setColor("#d78ee4").setTitle("Existing quotes found").setDescription("If you change your mind, just set the gallery channel again.");

    const updatedActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("set-gallery yes " + galleryChannelId)
        .setLabel("Yes")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("set-gallery no " + galleryChannelId)
        .setLabel("No")
        .setStyle(ButtonStyle.Success)
        .setDisabled(true)
    );

    interaction.update({ embeds: [updatedEmbedMessage], components: [updatedActionRow] });
  }
};

export { commandData, handleInteraction, handleButton };
