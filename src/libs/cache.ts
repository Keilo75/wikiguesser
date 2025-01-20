import type { Game } from "../models/game";
import { Logger } from "./logger";
import { createGame } from "./wiki";

type CacheState = {
  game: Game;
  guilds: Set<string>;
};

export class Cache {
  private cache: CacheState | null = null;

  public async getGame(guildId: string | null): Promise<Game> {
    if (this.cache !== null && guildId !== null) {
      if (!this.cache.guilds.has(guildId)) {
        Logger.log(`Reading game for guild ${guildId} from cache.`);
        this.cache.guilds.add(guildId);
        return this.cache.game;
      }
    }

    Logger.log(`Fetching game for guild ${guildId}.`);
    const game = await createGame();

    // Reset cache, as a new game was created
    this.cache = {
      game,
      guilds: guildId ? new Set([guildId]) : new Set(),
    };

    return game;
  }
}
