export type Game = {
  censoredText: string;
  originalText: string;
  correctOption: string;
  correctOptionUrl: string;
  options: { title: string; url: string }[];
};
