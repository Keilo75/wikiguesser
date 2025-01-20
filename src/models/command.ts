import type {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} from "discord.js";

type Args = {
  interaction: ChatInputCommandInteraction;
  client: Client;
};

export type Command = {
  data: SlashCommandBuilder;
  execute: (args: Args) => Promise<void>;
};
