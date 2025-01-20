import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";

export const about: Command = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription(t("commands.about")),
  execute: async ({ interaction }) => {
    const embed = new EmbedBuilder()
      .setColor(Colors.White)
      .setTitle(t("about.title"))
      .setDescription(t("about.description"))
      .addFields({ name: t("about.links-title"), value: t("about.links") })
      .setFooter({ text: t("about.footer") });
    await interaction.reply({ embeds: [embed] });
  },
};
