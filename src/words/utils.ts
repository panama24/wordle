export function getWord(wordList: string[]) {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

export function scoreWord(guess: string, target: string) {
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
          present.set(char, guessIndex);
          scores[guessIndex] = "present";
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
