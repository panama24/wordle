export const MAX_WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
export const BACKSPACE = "Backspace";
export const DEL = "DEL";
export const ENTER = "Enter";

export const LOCAL_STORAGE_STATS_KEY = "wordle-clone-stats";
export const LOCAL_STORAGE_STATE_KEY = "wordle-clone-game-state";

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

// need a way to reset the resettable game state: activeRow, boardState, scores, gameStatus
// maintain the lastCompletedTs
// two reducers: game, stats
// game state saved to localStorage on enter and/or game over, reset (every 24 hours?)
// stats saved to localStorage only when game over
// merge state on load with localStorage
