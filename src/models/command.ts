import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

type Args = {
  interaction: ChatInputCommandInteraction;
};

export type Command = {
  data: SlashCommandBuilder;
  execute: (args: Args) => Promise<void>;
};
