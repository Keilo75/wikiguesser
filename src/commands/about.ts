import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";

export const about: Command = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription(t("commands.about")),
  execute: async ({ interaction, storage }) => {
    const userCount = await storage.fetchUserCount();

    const embed = new EmbedBuilder()
      .setColor(Colors.White)
      .setTitle(t("about.title"))
      .setDescription(t("about.description"))
      .addFields(
        {
          name: t("about.user-count"),
          value: userCount.toString(),
          inline: true,
        },
        {
          name: t("about.source-code"),
          value: t("about.github"),
          inline: true,
        }
      )
      .setFooter({ text: t("about.footer") });
    await interaction.reply({ embeds: [embed] });
  },
};
