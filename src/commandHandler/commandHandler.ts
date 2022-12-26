import { Interaction, REST, Routes } from "discord.js";
import { Db } from "mongodb";
import { createClient } from "redis";
import * as quote from "./commands/quote";
import * as setGallery from "./commands/setGallery";
import * as list from "./commands/list";

const commands = [quote.commandData, setGallery.commandData, list.commandData];

export const handleInteractions = async (interaction: Interaction, database: Db, redisClient: ReturnType<typeof createClient>) => {
  if (interaction.isCommand()) {
    switch (interaction.commandName) {
      case "quote": {
        quote.handleInteraction(interaction, database, redisClient);
        break;
      }

      case "set-gallery": {
        setGallery.handleInteraction(interaction, database, redisClient);
        break;
      }

      case "list": {
        list.handleInteraction(interaction, database, redisClient);
        break;
      }
    }
  }

  if (interaction.isButton()) {
    console.log(interaction);
    const idParams = interaction.customId.split(" ");

    switch (idParams[0]) {
      case "set-gallery": {
        setGallery.handleButton(interaction, database, redisClient);
        break;
      }
    }
  }
};

export const registerCommands = async (rest: REST, clientId: string) => {
  await rest.put(Routes.applicationCommands(clientId), {
    body: commands,
  });
};
