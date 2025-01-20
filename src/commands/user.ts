import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";

export const user: Command = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription(t("commands.user"))
    .addUserOption((opt) =>
      opt
        .setName("user")
        .setDescription(t("commands.user-option"))
        .setRequired(false)
    ),
  execute: async ({ interaction, storage }) => {
    const userInput = interaction.options.get("user")?.user || interaction.user;
    if (userInput.bot) {
      await interaction.reply({ content: t("messages.stats-bot") });
      return;
    }

    const stats = await storage.fetchUserStats(userInput.id);

    if (stats === null) {
      await interaction.reply({ content: t("messages.stats-not-found") });
      return;
    }
  },
};
