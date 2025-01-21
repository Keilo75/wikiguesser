import Database from "better-sqlite3";

import type { Storage, StorageUserStats } from "../models/storage";
import { Logger } from "./logger";

const db = new Database(process.env.DB_PATH, {
  fileMustExist: true,
});

export const storage: Storage = {
  fetchUserStats: async (id) => {
    Logger.log(`Fetching user with id ${id}.`);
    const result = db
      .prepare<{ id: string }, StorageUserStats>(
        "SELECT * FROM user WHERE ID = @id"
      )
      .get({ id });
    Logger.debug("Database Response", result);

    if (!result) {
      return null;
    }

    return {
      id,
      gameCount: result.GameCount,
      correctGuesses: result.CorrectGuesses,
      wrongGuesses: result.WrongGuesses,
      currentStreak: result.CurrentStreak,
      highestStreak: result.HighestStreak,
    };
  },
  updateUserStats: async (stats) => {
    Logger.log(`Updating stats for user with id ${stats.id}.`);
    Logger.debug("Updated Stats", stats);

    db.prepare(
      `
      INSERT OR REPLACE INTO user (ID, GameCount, CorrectGuesses, WrongGuesses, CurrentStreak, HighestStreak)
      VALUES (@id, @gameCount, @correctGuesses, @wrongGuesses, @currentStreak, @highestStreak)
      `
    ).run(stats);
  },
};
