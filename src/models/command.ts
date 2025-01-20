import type {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

import type { Cache } from "../libs/cache";
import type { Storage } from "./storage";

type Args = {
  interaction: ChatInputCommandInteraction;
  client: Client;
  storage: Storage;
  cache: Cache;
};

export type Command = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (args: Args) => Promise<void>;
};
