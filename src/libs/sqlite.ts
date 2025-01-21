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
      incorrectGuesses: result.IncorrectGuesses,
      currentStreak: result.CurrentStreak,
      highestStreak: result.HighestStreak,
    };
  },
  updateUserStats: async (stats) => {
    Logger.log(`Updating stats for user with id ${stats.id}.`);
    Logger.debug("Updated Stats", stats);

    db.prepare(
      `
      INSERT OR REPLACE INTO user (ID, GameCount, CorrectGuesses, IncorrectGuesses, CurrentStreak, HighestStreak)
      VALUES (@id, @gameCount, @correctGuesses, @incorrectGuesses, @currentStreak, @highestStreak)
      `
    ).run(stats);
  },

  fetchUserCount: async () => {
    Logger.log("Fetching user count.");
    const userCount = db
      .prepare<unknown[], { count: number }>(
        "SELECT Count(ID) as count FROM user"
      )
      .get();
    Logger.debug("Database Response", userCount);

    return userCount?.count || 0;
  },
};
