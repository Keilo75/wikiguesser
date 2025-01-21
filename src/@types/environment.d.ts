declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      CLIENT_ID: string;
      GUILD_ID: string;
      DB_PATH: string;
      DEV?: boolean;
    }
  }
}

export {};
