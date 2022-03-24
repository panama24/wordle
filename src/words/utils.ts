import { words } from "./wordList";
import { BoardState } from "../components/Grid";

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
