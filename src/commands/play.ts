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

    const embed = new EmbedBuilder()
      .setTitle(t("play.title", { seconds: GUESS_TIME_SECONDS }))
      .setColor(Colors.White)
      .setDescription(game.censoredText)
      .setFooter({
        text: interaction.user.displayName,
        iconURL: interaction.user.displayAvatarURL({ forceStatic: true }),
      });

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

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
