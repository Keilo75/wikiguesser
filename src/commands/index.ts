import { type Command } from "../models/command";
import { about } from "./about";
import { ping } from "./ping";

export const commands = new Map<string, Command>();
const addCommandsToMap = (...commandsToAdd: Command[]) => {
  commandsToAdd.forEach((c) => commands.set(c.data.name, c));
};

addCommandsToMap(ping, about);
