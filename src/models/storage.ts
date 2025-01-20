export type UserStats = {
  id: string;
  gameCount: number;
  correctGuesses: number;
  wrongGuesses: number;
  currentStreak: number;
  highestStreak: number;
};

export type Storage = {
  fetchUserStats: (id: string) => Promise<UserStats | null>;
  updateUserStats: (stats: UserStats) => Promise<void>;
};
