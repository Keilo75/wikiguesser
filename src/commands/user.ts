import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
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

    const embed = new EmbedBuilder()
      .setTitle(t("user.title", { user: userInput.displayName }))
      .setThumbnail(userInput.displayAvatarURL({ forceStatic: true }))
      .addFields(
        {
          name: t("user.game-count"),
          value: stats.gameCount.toString(),
          inline: true,
        },
        {
          name: t("user.correct-guesses"),
          value: stats.correctGuesses.toString(),
          inline: true,
        },
        {
          name: t("user.wrong-guesses"),
          value: stats.wrongGuesses.toString(),
          inline: true,
        },
        {
          name: t("user.accuracy"),
          value: t("format.percentage", {
            percentage: stats.correctGuesses / stats.gameCount,
          }),
          inline: true,
        },
        {
          name: t("user.current-streak"),
          value: stats.currentStreak.toString(),
          inline: true,
        },
        {
          name: t("user.highest-streak"),
          value: stats.highestStreak.toString(),
          inline: true,
        }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
