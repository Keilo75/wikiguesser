import type {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} from "discord.js";

import type { Storage } from "./storage";

type Args = {
  interaction: ChatInputCommandInteraction;
  client: Client;
  storage: Storage;
};

export type Command = {
  data: SlashCommandBuilder;
  execute: (args: Args) => Promise<void>;
};
