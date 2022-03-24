export const MAX_WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
export const BACKSPACE = "Backspace";
export const DEL = "DEL";
export const ENTER = "Enter";

export enum GameStatus {
  InProgress,
  Win,
  Lose,
}

export type BoardState = string[];
export type Score = string[] | null[];
export type Scores = Score[];

export type GuessDistribution = Record<string, number>;

export type Statistics = {
  currentStreak: number;
  maxStreak: number;
  played: number;
  winPercentage: number;
  guessDistribution: GuessDistribution;
};

export type GameState = {
  boardState: BoardState;
  lastCompletedTs: number;
  status: GameStatus;
  scores: Scores;
};
