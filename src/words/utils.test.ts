import { getWord, mapLetterIndexes, scoreWord } from "./utils";

describe("getWord", () => {
  it("returns a word from the word list", () => {
    const list = ["forth", "hello", "dealt"];
    const result = getWord(list);
    expect(result.length).toEqual(5);
    expect(list.includes(result)).toBeTruthy();
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
