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
  activeRow: number;
  boardState: BoardState;
  lastCompletedTs: number;
  status: GameStatus;
  scores: Scores;
};

// TODO: handle word of the day!
// TODO: handle modal popping back up after game reset
// game state saved to localStorage on enter and/or game over, reset (every 24 hours?)
