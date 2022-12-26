import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, TextChannel, ChannelType, APIEmbedField, Channel, ButtonStyle } from "discord.js";
import { Db } from "mongodb";
import { createClient } from "redis";
import { Pagination } from "discordjs-button-embed-pagination";
import { createErrorEmbed } from "../../utils/createErrorEmbed";

const splitArrToArr = (arr: any[], size: number) => {
  let newArr = [];

  for (let i = 0; i < arr.length; i += size) {
    newArr.push(arr.slice(i, i + size));
  }

  return newArr;
};

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

    const quotes =
      author === undefined
        ? await collection.find().sort("createDate").toArray()
        : await collection
            .find({ author: new RegExp(author as string, "i") })
            .sort("createDate")
            .toArray();

    const splitQuotes = splitArrToArr(quotes, 10);

    let listEmbeds = [];

    for (let i = 0; i < splitQuotes.length; i++) {
      const page = new EmbedBuilder().setColor("#d78ee4");
      author === undefined ? new EmbedBuilder().setTitle(`All Quotes`) : new EmbedBuilder().setTitle(`Quotes by ${author}`);
      let fields: APIEmbedField[] = [];

      for (let j = 0; j < splitQuotes[i].length; j++) {
        fields.push({ name: splitQuotes[i][j].quote, value: `${splitQuotes[i][j].author} - ${new Date(splitQuotes[i][j].createDate).toDateString()}` });
      }

      page.addFields(fields);

      listEmbeds.push(page);
    }

    await new Pagination(interaction.channel as TextChannel, listEmbeds, "Page", 180000, [
      {
        style: ButtonStyle.Secondary,
        emoji: "⏮️",
      },
      {
        style: ButtonStyle.Primary,
        emoji: "◀️",
      },
      {
        style: ButtonStyle.Danger,
        emoji: "⏹️",
      },
      {
        style: ButtonStyle.Primary,
        emoji: "▶️",
      },
      {
        style: ButtonStyle.Secondary,
        emoji: "⏭️",
      },
    ]).paginate();

    return;
  } catch (err) {
    console.error(err);
    const errorEmbed = createErrorEmbed("List Error", "There was an error listing the quotes. Please try again or contact an admin.");
    await interaction.reply({ embeds: [errorEmbed] });
    return;
  }
};

export { commandData, handleInteraction };
