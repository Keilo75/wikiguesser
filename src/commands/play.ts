import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";

export const play: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(t("commands.play")),
  execute: async ({ interaction, cache }) => {
    const game = await cache.getGame(interaction.guildId);
    await interaction.reply(JSON.stringify(game));
  },
};
