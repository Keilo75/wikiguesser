import Database from "better-sqlite3";

import type { Storage } from "../models/storage";

const db = new Database(process.env.DB_PATH, {
  fileMustExist: true,
});

export const storage: Storage = {
  fetchUserStats: async (id) => {
    const result = db.prepare("SELECT * FROM user WHERE ID = @id").get({ id });
    if (result === undefined) return null;

    return null;
  },
  updateUserStats: async () => {},
};
