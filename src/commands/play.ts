import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";
import { UserStatsUpdater } from "../models/storage";

const GUESS_TIME_SECONDS = 10;

export const play: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(t("commands.play")),
  execute: async ({ interaction, cache, storage }) => {
    const userStats = await storage.fetchUserStats(interaction.user.id);
    const userStatsUpdater = new UserStatsUpdater(
      interaction.user.id,
      userStats
    );

    const game = await cache.getGame(interaction.guildId);
    const footer = {
      text: interaction.user.displayName,
      iconURL: interaction.user.displayAvatarURL({ forceStatic: true }),
    };

    const embed = new EmbedBuilder()
      .setTitle(t("play.title", { seconds: GUESS_TIME_SECONDS }))
      .setColor(Colors.White)
      .setDescription(game.censoredText)
      .setFooter(footer);

    const buttons = game.options.map((opt) =>
      new ButtonBuilder()
        .setCustomId(opt)
        .setStyle(ButtonStyle.Primary)
        .setLabel(opt)
    );

    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        buttons
      );

    const message = await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    const errorEmbed = new EmbedBuilder()
      .setFooter(footer)
      .setColor(Colors.Red)
      .setDescription(
        t("error.description", {
          answer: game.correctOption,
          answerUrl: game.correctOptionUrl,
          extract: game.originalText,
        })
      );

    try {
      const response = await message.awaitMessageComponent({
        filter: (i) => i.user.id === interaction.user.id,
        componentType: ComponentType.Button,
        time: GUESS_TIME_SECONDS * 1000,
      });

      if (response.customId === game.correctOption) {
        // TODO: Correct
        // TODO: Rename wrong to incorrect
      } else {
        await message.edit({
          embeds: [errorEmbed.setTitle(t("error.incorrect"))],
          components: [],
        });
      }
    } catch {
      await message.edit({
        embeds: [errorEmbed.setTitle(t("error.timeout"))],
        components: [],
      });
      await storage.updateUserStats(userStatsUpdater.addWrongGuess());
    }
  },
};
