import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";

const GUESS_TIME_SECONDS = 10;

export const play: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(t("commands.play")),
  execute: async ({ interaction, cache }) => {
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

    try {
      await message.awaitMessageComponent({
        filter: (i) => i.user.id === interaction.user.id,
        time: GUESS_TIME_SECONDS * 1000,
      });
    } catch {
      const timeoutEmbed = new EmbedBuilder()
        .setTitle(t("timeout.title"))
        .setFooter(footer)
        .setColor(Colors.Red)
        .setDescription(
          t("timeout.description", {
            answer: game.correctOption,
            answerUrl: game.correctOptionUrl,
            extract: game.originalText,
          })
        );

      await message.edit({ embeds: [timeoutEmbed], components: [] });
    }
  },
};
