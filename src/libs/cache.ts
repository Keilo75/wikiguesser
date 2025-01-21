import type { Game } from "../models/game";
import { Logger } from "./logger";
import { createGame } from "./wiki";

const MAX_CACHE_MS = 10_000;

type CacheState = {
  game: Game;
  guilds: Set<string>;
  timestamp: number;
};

export class Cache {
  private cache: CacheState | null = null;

  private url: string;
  private userAgent: string;

  constructor(url: string, userAgent: string) {
    this.url = url;
    this.userAgent = userAgent;
  }

  public async getGame(guildId: string | null): Promise<Game> {
    if (this.cache !== null && guildId !== null) {
      if (
        !this.cache.guilds.has(guildId) &&
        Date.now() - this.cache.timestamp < MAX_CACHE_MS
      ) {
        Logger.log(`Reading game for guild ${guildId} from cache.`);
        this.cache.guilds.add(guildId);
        return this.cache.game;
      }
    }

    Logger.log(`Fetching game for guild ${guildId}.`);
    const game = await createGame(this.url, this.userAgent);
    Logger.debug("Game", game);

    // Reset cache, as a new game was created
    this.cache = {
      game,
      guilds: guildId ? new Set([guildId]) : new Set(),
      timestamp: Date.now(),
    };

    return game;
  }
}
