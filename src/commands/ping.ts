import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(t("commands.ping")),
  execute: async ({ interaction }) => {
    const sent = await interaction.reply({
      content: t("messages.pinging"),
      withResponse: true,
    });
    const latency =
      sent.resource?.message?.createdTimestamp ||
      0 - interaction.createdTimestamp;
    await interaction.editReply(t("messages.pinged", { latency }));
  },
};
