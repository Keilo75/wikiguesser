import chalk from "chalk";

type LogLevel = "log" | "error" | "debug";

export class Logger {
  constructor() {}

  public static log(message: unknown) {
    console.log(this.getLogPrefix("log") + message);
  }

  public static error(message: unknown, error?: unknown) {
    console.error(this.getLogPrefix("error") + message);
    if (error) console.error(error);
  }

  public static debug(message: unknown, trace: unknown) {
    console.debug(this.getLogPrefix("debug") + message);
    console.debug(trace);
  }

  private static getLogPrefix(level: LogLevel): string {
    const time = new Date();

    return `${chalk.gray(`[${time.toISOString()}]`)} ${this.getLogLevel(
      level
    )} `;
  }

  private static getLogLevel(level: LogLevel): string {
    switch (level) {
      case "log":
        return chalk.blue("[LOG]");

      case "error":
        return chalk.red("[ERROR]");

      case "debug":
        return chalk.magenta("[DEBUG]");
    }
  }
}
