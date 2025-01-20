import Database from "better-sqlite3";

import type { Storage } from "../models/storage";

const db = new Database(process.env.DB_PATH, { fileMustExist: true });

const stmt = db.prepare("SELECT * FROM users").run();
console.log(stmt);

export const storage: Storage = {
  fetchUser: async (id) => {
    return null;
  },
  updateUser: async (user) => {},
};
