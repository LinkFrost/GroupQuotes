import { Interaction, REST, Routes } from "discord.js";
import Ping from "./commands/ping";

const commands = [Ping.commandData];

export const handleInteraction = async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  switch (interaction.commandName) {
    case "ping": {
      Ping.interaction(interaction);
      break;
    }
  }
};

export const registerCommands = async (rest: REST, clientId: string) => {
  await rest.put(Routes.applicationCommands(clientId), {
    body: commands,
  });
};
