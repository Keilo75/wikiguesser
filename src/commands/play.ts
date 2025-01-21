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

    const playRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        game.options.map(({ title }) =>
          new ButtonBuilder()
            .setCustomId(title)
            .setStyle(ButtonStyle.Primary)
            .setLabel(title)
        )
      );

    const linkRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        game.options.map(({ title, url }) =>
          new ButtonBuilder()
            .setLabel(title)
            .setStyle(ButtonStyle.Link)
            .setURL(url)
        )
      );

    const message = await interaction.editReply({
      embeds: [embed],
      components: [playRow],
    });

    try {
      const response = await message.awaitMessageComponent({
        filter: (i) => i.user.id === interaction.user.id,
        componentType: ComponentType.Button,
        time: GUESS_TIME_SECONDS * 1000,
      });

      if (response.customId === game.correctOption) {
        const updatedStats = userStatsUpdater.addCorrectGuess();

        await response.editReply({
          embeds: [createSuccessEmbed(response, game, updatedStats)],
          components: [linkRow],
        });
        await storage.updateUserStats(updatedStats);
      } else {
        await response.editReply({
          embeds: [createErrorEmbed("incorrect", response, game)],
          components: [linkRow],
        });
        await storage.updateUserStats(userStatsUpdater.addIncorrectGuess());
      }
    } catch {
      await message.edit({
        embeds: [createErrorEmbed("timeout", interaction, game)],
        components: [linkRow],
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
