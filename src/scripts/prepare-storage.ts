import Database from "better-sqlite3";
import dotenv from "dotenv";
import fs from "fs";

import { Logger } from "../libs/logger";

dotenv.config();

if (fs.existsSync(process.env.DB_PATH)) {
  Logger.error(`Database at ${process.env.DB_PATH} already exists. Aborting.`);
  process.exit(1);
}

const db = new Database(process.env.DB_PATH, { fileMustExist: false });
db.prepare(
  `
  CREATE TABLE user (
    ID varchar(255) NOT NULL,
    GameCount int NOT NULL,
    CorrectGuesses int,
    WrongGuesses int NOT NULL,
    CurrentStreak int NOT NULL,
    HighestStreak int NOT NULL
  );`
).run();

Logger.log("Created users table succesfully.");
