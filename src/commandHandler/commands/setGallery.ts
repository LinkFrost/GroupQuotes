import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, TextChannel } from "discord.js";
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

    const quotes = await collection.find().sort("createDate").toArray();

    if (quotes.length > 0) {
      // for(const quote of quotes) {
      //   const embedGalleryQuote = new EmbedBuilder().setColor("#d78ee4").setTitle(`"${quote.quote}"`).setDescription(`- ${quote.author}`).setTimestamp();

      //   const channel = interaction.client.channels.cache.find(channel => {if(channel.id === galleryChannelId && channel.type === ChannelType.GuildText) return channel.id}) as TextChannel;

      //   await channel.send({ embeds: [embedGalleryQuote] });
      // }

      await interaction.reply("hi");
    } else {
      const embedReply = new EmbedBuilder().setColor("#d78ee4").setTitle("Gallery Channel Set").setDescription(`New quotes will be sent to <#${galleryChannelId}> This can be changed later with the same command`).setTimestamp();
      await interaction.reply({ embeds: [embedReply] });
    }
  } catch (err) {
    console.error(err);
    interaction.reply("There was an error in setting the gallery channel. Please try again or contact an admin");
  }
};

export { commandData, handleInteraction };
