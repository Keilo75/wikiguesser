import "./libs/i18n";

import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { t } from "i18next";

import { commands } from "./commands";
import { Cache } from "./libs/cache";
import { Logger } from "./libs/logger";

dotenv.config();
// This import must happen after dotenv
// as it creates the db as a side effect.
import { storage } from "./libs/sqlite";

const cache = new Cache();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  presence: {
    activities: [
      {
        name: t("status"),
        type: ActivityType.Custom,
      },
    ],
  },
});

client.once(Events.ClientReady, (readyClient) => {
  Logger.log(`Logged in as ${readyClient.user.tag}.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const command = commands.get(commandName);
  if (!command) {
    Logger.error(`Unable to find '${commandName}' command.`);
    await interaction.reply(t("messages.error"));
    return;
  }

  try {
    await command.execute({ interaction, client, storage, cache });
  } catch (err) {
    Logger.error(`Error while executing ${commandName}.`, err);

    const content = t("messages.error");

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content });
    } else {
      await interaction.reply({ content });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
