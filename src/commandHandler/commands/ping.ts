import { CommandInteraction, SlashCommandBuilder } from "discord.js";

const Ping = {
  commandData: new SlashCommandBuilder().setName("ping").setDescription("Test slash command").toJSON(),
  interaction: async (interaction: CommandInteraction) => {
    await interaction.reply("Pong!");
  },
};

export default Ping;
