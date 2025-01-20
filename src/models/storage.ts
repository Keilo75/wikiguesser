export type User = {
  id: string;
  gameCount: number;
  correctGuesses: number;
  wrongGuesses: number;
  currentStreak: number;
  highestStreak: number;
};

export type Storage = {
  fetchUser: (id: string) => Promise<User | null>;
  updateUser: (user: User) => Promise<void>;
};
