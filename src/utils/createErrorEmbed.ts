import { EmbedBuilder } from "discord.js";

const createErrorEmbed = (title: string, errorMsg: string) => {
  const embed = new EmbedBuilder().setTitle(title).setDescription(errorMsg).setColor("#d78ee4");

  return embed;
};

export { createErrorEmbed };
