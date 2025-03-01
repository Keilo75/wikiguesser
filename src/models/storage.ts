export type UserStats = {
  id: string;
  gameCount: number;
  correctGuesses: number;
  incorrectGuesses: number;
  currentStreak: number;
  highestStreak: number;
};

export type StorageUserStats = {
  [key in keyof UserStats as Capitalize<key>]: UserStats[key];
};

export class UserStatsUpdater {
  public stats: UserStats;

  constructor(id: string, stats: UserStats | null) {
    this.stats = stats || {
      id,
      gameCount: 0,
      correctGuesses: 0,
      incorrectGuesses: 0,
      currentStreak: 0,
      highestStreak: 0,
    };
  }

  public addIncorrectGuess(): UserStats {
    this.stats.gameCount++;

    this.stats.incorrectGuesses++;
    this.stats.currentStreak = 0;

    return this.stats;
  }

  public addCorrectGuess(): UserStats {
    this.stats.gameCount++;

    this.stats.correctGuesses++;
    this.stats.currentStreak++;
    this.stats.highestStreak = Math.max(
      this.stats.currentStreak,
      this.stats.highestStreak
    );

    return this.stats;
  }
}

export type Storage = {
  fetchUserStats: (id: string) => Promise<UserStats | null>;
  updateUserStats: (stats: UserStats) => Promise<void>;
  fetchUserCount: () => Promise<number>;
};
