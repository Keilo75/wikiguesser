import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  EmbedBuilder,
  type Interaction,
  type MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";
import type { Game } from "../models/game";
import { type UserStats, UserStatsUpdater } from "../models/storage";

const GUESS_TIME_SECONDS = 10;

export const play: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(t("commands.play")),
  execute: async ({ interaction, cache, storage }) => {
    await interaction.deferReply();

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

    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        game.options.map((opt) =>
          new ButtonBuilder()
            .setCustomId(opt)
            .setStyle(ButtonStyle.Primary)
            .setLabel(opt)
        )
      );

    const message = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    try {
      const response = await message.awaitMessageComponent({
        filter: (i) => i.user.id === interaction.user.id,
        componentType: ComponentType.Button,
        time: GUESS_TIME_SECONDS * 1000,
      });

      if (response.customId === game.correctOption) {
        const updatedStats = userStatsUpdater.addCorrectGuess();

        await message.edit({
          embeds: [createSuccessEmbed(interaction, game, updatedStats)],
          components: [],
        });
        await storage.updateUserStats(updatedStats);
      } else {
        await message.edit({
          embeds: [createErrorEmbed("incorrect", interaction, game)],
          components: [],
        });
        await storage.updateUserStats(userStatsUpdater.addIncorrectGuess());
      }
    } catch {
      await message.edit({
        embeds: [createErrorEmbed("timeout", interaction, game)],
        components: [],
      });
      await storage.updateUserStats(userStatsUpdater.addIncorrectGuess());
    }
  },
};

function createSuccessEmbed(
  interaction: Interaction,
  game: Game,
  updatedStats: UserStats
): EmbedBuilder {
  const description = t("play.correct-answer", {
    answer: game.correctOption,
    answerUrl: game.correctOptionUrl,
    extract: game.originalText,
  });

  return new EmbedBuilder()
    .setTitle(t("play.correct"))
    .setDescription(description)
    .setColor(Colors.Green)
    .addFields({
      name: t("user.current-streak"),
      value: updatedStats.currentStreak.toString(),
    })
    .setFooter({
      text: interaction.user.displayName,
      iconURL: interaction.user.displayAvatarURL({ forceStatic: true }),
    });
}

function createErrorEmbed(
  reason: "timeout" | "incorrect",
  interaction: Interaction,
  game: Game
): EmbedBuilder {
  const description = t("play.correct-answer", {
    answer: game.correctOption,
    answerUrl: game.correctOptionUrl,
    extract: game.originalText,
  });

  return new EmbedBuilder()
    .setColor(Colors.Red)
    .setDescription(description)
    .setTitle(t(`play.${reason}`))
    .setFooter({
      text: interaction.user.displayName,
      iconURL: interaction.user.displayAvatarURL({ forceStatic: true }),
    });
}
