import { words } from "./wordList";
import {
  BoardState,
  GameState,
  GameStatus,
  GuessDistribution,
  MAX_GUESSES,
  MAX_WORD_LENGTH,
  Scores,
  Statistics,
} from "../constants";

const wordsForWinners = [
  "Fabulous",
  "Wonderful",
  "Amazing",
  "Splendid",
  "Fantastic",
];

export const wordForTheWinner = getWord(wordsForWinners);

export const wordOfTheDay = getWord(words);

export function getWord(wordList: string[]) {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

export const initialBoardState = (): BoardState => ["", "", "", "", "", ""];

export const initialScores = (): Scores =>
  [...Array(MAX_GUESSES)].map((_) => Array(MAX_WORD_LENGTH).fill(null));

export function isValidGuess(guess: string) {
  return words.includes(guess);
}

export function hasWon(score: string[]) {
  return score.every((s) => s === "correct");
}

export function scoreWord(guess: string, target: string): string[] {
  const scores = Array(target.length);
  const targetMap = mapLetterIndexes(target);
  const guessMap = mapLetterIndexes(guess);

  const seen = new Set();
  const guessKeys = Array.from(guessMap.keys());
  for (const char of guessKeys) {
    const guessIndexes = guessMap.get(char);

    if (!targetMap.get(char)) {
      guessIndexes.forEach((i: number) => (scores[i] = "absent"));
      continue;
    }

    const targetIndexes = targetMap.get(char);
    const present = new Map();
    for (let i = guessIndexes.length - 1; i >= 0; i--) {
      const guessIndex = guessIndexes[i];
      if (targetIndexes.includes(guessIndex)) {
        seen.add(char);
        scores[guessIndex] = "correct";
        if (present.has(char)) {
          scores[present.get(char)] = "absent";
        }
      } else {
        if (seen.has(char)) {
          scores[guessIndex] = "absent";
        } else {
          if (present.has(char)) {
            scores[guessIndex] = "present";
            scores[present.get(char)] = "absent";
            present.set(char, guessIndex);
          } else {
            present.set(char, guessIndex);
            scores[guessIndex] = "present";
          }
        }
      }
    }
  }

  return scores;
}

export function mapLetterIndexes(word: string) {
  const map = new Map();
  const splitWord = word.split("");
  for (let i in splitWord) {
    map.has(splitWord[i])
      ? map.get(splitWord[i]).push(Number(i))
      : map.set(splitWord[i], [Number(i)]);
  }
  return map;
}

export function mapKeyboardScores(guesses: BoardState, target: string) {
  const mappedScores: Record<string, string | undefined> = {};
  const splitTarget = target.split("");

  guesses.forEach((guess) => {
    const splitGuess = guess.split("");
    splitGuess.forEach((char, i) => {
      if (!splitTarget.includes(char)) {
        return (mappedScores[char] = "absent");
      }

      if (splitTarget[i] === char) {
        return (mappedScores[char] = "correct");
      }

      if (mappedScores[char] !== "correct") {
        return (mappedScores[char] = "present");
      }
    });
  });

  return mappedScores;
}

export function incrementGamesPlayed(prevPlays: number = 0): number {
  return prevPlays + 1;
}

export function calculateWinPercentage(
  plays: number = 0,
  wins: number = 0
): number {
  if (plays === 0 && wins === 0) return 0;
  return Math.round((wins / plays) * 100);
}

export function calculateStreaks(
  current: number,
  max: number,
  lastCompletedTs: number
): Record<string, number> {
  const diffInHours = Math.round(
    (new Date().valueOf() - lastCompletedTs) / 60000 / 60 / 24
  );
  const nextCurrent = diffInHours > 24 ? 0 : current + 1;
  const nextMax = nextCurrent > max ? nextCurrent : max;

  return {
    currentStreak: nextCurrent,
    maxStreak: nextMax,
  };
}

export const defaultGuessDistribution = () => ({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  fail: 0,
});

export function mapGuessDistribution(
  status: number,
  guessNumber: number,
  previousDistribution: GuessDistribution = defaultGuessDistribution()
): GuessDistribution {
  if (status === GameStatus.Lose) {
    return {
      ...previousDistribution,
      fail: previousDistribution.fail + 1,
    };
  } else {
    return {
      ...previousDistribution,
      [guessNumber]: previousDistribution[guessNumber] + 1,
    };
  }
}

export function calculateGamesWon(
  guessDistribution: GuessDistribution
): number {
  let count = 0;
  for (const key in guessDistribution) {
    if (!isNaN(Number(key))) {
      count += guessDistribution[key];
    }
  }
  return count;
}

// on game over, we calculate statistics
// increment games played
// increment win percentage accordingly
// calculate current and max streaks before resetting last completed timestamp
// set last completed timestamp
// calculate guess distribution
// for UI - modal

export function getGuessNumber(boardState: BoardState) {
  return boardState.reduce((acc, curr) => {
    if (curr !== "") acc += 1;
    return acc;
  }, 0);
}

export function calculateStatistics(
  prevStats: Statistics,
  gameState: GameState
): Record<string, any> {
  const { boardState, lastCompletedTs, status } = gameState;
  const { currentStreak, guessDistribution, maxStreak, played } = prevStats;

  const streaks = calculateStreaks(currentStreak, maxStreak, lastCompletedTs);
  const dist = mapGuessDistribution(
    status,
    getGuessNumber(boardState),
    guessDistribution
  );
  const plays = incrementGamesPlayed(played);
  const wins = calculateGamesWon(dist);
  const winPercentage = calculateWinPercentage(plays, wins);

  return {
    ...streaks,
    played: plays,
    winPercentage,
    guessDistribution: dist,
  };
}
