import {
  getWord,
  isValidGuess,
  mapKeyboardScores,
  mapLetterIndexes,
  scoreWord,
  wordOfTheDay,
} from "./utils";

describe("getWord", () => {
  it("returns a word from the word list", () => {
    const list = ["forth", "hello", "dealt"];
    const result = getWord(list);
    expect(result.length).toEqual(5);
    expect(list.includes(result)).toBeTruthy();
  });
});

describe("isValidGuess", () => {
  it("returns false if word is not in word list", () => {
    expect(isValidGuess("aaaaa")).toBeFalsy();
  });

  it("returns true if word is in word list", () => {
    expect(isValidGuess("hello")).toBeTruthy();
  });
});

describe("mapKeyboardScores", () => {
  it("returns a mapping of keyboard keys to scores", () => {
    const scores = ["growl"];
    const mappedScores = mapKeyboardScores(scores, "hello");
    expect(mappedScores["g"]).toEqual("absent");
    expect(mappedScores["r"]).toEqual("absent");
    expect(mappedScores["o"]).toEqual("present");
    expect(mappedScores["w"]).toEqual("absent");
    expect(mappedScores["l"]).toEqual("present");
    expect(mappedScores["b"]).toBeUndefined();
  });

  it("returns a mapping of keyboard keys to scores", () => {
    const scores = ["growl", "melts", "hello"];
    const mappedScores = mapKeyboardScores(scores, "hello");
    expect(mappedScores["g"]).toEqual("absent");
    expect(mappedScores["r"]).toEqual("absent");
    expect(mappedScores["o"]).toEqual("correct");
    expect(mappedScores["w"]).toEqual("absent");
    expect(mappedScores["l"]).toEqual("correct");
    expect(mappedScores["m"]).toEqual("absent");
    expect(mappedScores["e"]).toEqual("correct");
    expect(mappedScores["t"]).toEqual("absent");
    expect(mappedScores["h"]).toEqual("correct");
    expect(mappedScores["s"]).toEqual("absent");
  });
});

describe("mapLetterIndexes", () => {
  it("returns a Map whose values are an array of letter indexes", () => {
    const map = mapLetterIndexes("hello");
    expect(map.size).toEqual(4);
    expect(map.get("l")).toEqual([2, 3]);
  });
});

describe("scoreWord", () => {
  it("returns an array of score strings per letter", () => {
    const result = scoreWord("hello", "fecal");
    expect(result).toEqual([
      "absent",
      "correct",
      "present",
      "absent",
      "absent",
    ]);
  });

  it("returns an array of score strings per letter", () => {
    const result = scoreWord("hello", "below");
    expect(result.length).toEqual(5);
  });

  it("scores the word correctly with repeat letters", () => {
    const result = scoreWord("hello", "below");
    expect(result).toEqual([
      "absent",
      "correct",
      "correct",
      "absent",
      "present",
    ]);
  });

  it("scores the word correctly with repeat letters", () => {
    const result = scoreWord("below", "hello");
    expect(result).toEqual([
      "absent",
      "correct",
      "correct",
      "present",
      "absent",
    ]);
  });

  it("scores the word correctly with repeat letters", () => {
    const result = scoreWord("yummy", "mummy");
    expect(result).toEqual([
      "absent",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("scores the word correctly when no letters match", () => {
    const result = scoreWord("yield", "proof");
    expect(result).toEqual(["absent", "absent", "absent", "absent", "absent"]);
  });

  it("scores the word correctly when all letters match", () => {
    const result = scoreWord("hello", "hello");
    expect(result).toEqual([
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });
});
