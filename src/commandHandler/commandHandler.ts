import { Interaction, REST, Routes } from "discord.js";
import * as quote from "./commands/quote";
import * as setGallery from "./commands/setGallery";
import { Db } from "mongodb";
import { createClient } from "redis";

const commands = [quote.commandData, setGallery.commandData];

export const handleInteractions = async (interaction: Interaction, database: Db, redisClient: ReturnType<typeof createClient>) => {
  if (!interaction.isCommand()) return;

  switch (interaction.commandName) {
    case "quote": {
      quote.handleInteraction(interaction, database, redisClient);
      break;
    }

    case "set-gallery": {
      setGallery.handleInteraction(interaction, database, redisClient);
      break;
    }
  }
};

export const registerCommands = async (rest: REST, clientId: string) => {
  await rest.put(Routes.applicationCommands(clientId), {
    body: commands,
  });
};
