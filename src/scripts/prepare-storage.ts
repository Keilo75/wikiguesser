import Database from "better-sqlite3";
import dotenv from "dotenv";
import fs from "fs";

import { Logger } from "../libs/logger";

dotenv.config();

if (fs.existsSync(process.env.DB_PATH)) {
  Logger.error(`Database at ${process.env.DB_PATH} already exists. Aborting.`);
  process.exit(1);
}

const db = new Database(process.env.DB_PATH, {
  fileMustExist: false,
});
const result = db
  .prepare(
    `
  CREATE TABLE user (
    ID varchar(255),
    GameCount int,
    CorrectGuesses int,
    WrongGuesses int,
    CurrentStreak int,
    HighestStreak int
  );`
  )
  .run();

Logger.log("Created user table succesfully.");
Logger.debug("Sqlite Response", result);
