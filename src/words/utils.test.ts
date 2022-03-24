import {
  BoardState,
  GameStatus,
  GuessDistribution,
  Scores,
  Statistics,
} from "../constants";
import {
  calculateGamesWon,
  calculateStatistics,
  calculateStreaks,
  calculateWinPercentage,
  defaultGuessDistribution,
  incrementGamesPlayed,
  initialBoardState,
  initialScores,
  getWord,
  isValidGuess,
  mapGuessDistribution,
  mapKeyboardScores,
  mapLetterIndexes,
  scoreWord,
} from "./utils";

describe("calculateGamesWon", () => {
  it("returns the number of wins", () => {
    const guessDist = defaultGuessDistribution();
    guessDist[2] = 3;
    guessDist[3] = 8;
    guessDist[4] = 3;
    guessDist[5] = 2;
    guessDist[6] = 5;
    expect(calculateGamesWon(guessDist)).toEqual(21);
  });

  it("returns the number of wins and does not include failures", () => {
    const guessDist = defaultGuessDistribution();
    guessDist[2] = 1;
    guessDist[3] = 1;
    guessDist[4] = 1;
    guessDist[5] = 1;
    guessDist[6] = 1;
    guessDist.fail = 5;
    expect(calculateGamesWon(guessDist)).toEqual(5);
  });
});

describe("calculateStatistics", () => {
  let boardState: BoardState,
    dist: GuessDistribution,
    scores: Scores,
    stats: Statistics;

  beforeEach(() => {
    boardState = initialBoardState();
    dist = defaultGuessDistribution();
    scores = initialScores();
    stats = {
      currentStreak: 0,
      maxStreak: 0,
      played: 0,
      winPercentage: 0,
      guessDistribution: dist,
    };
  });

  it("returns an object with the statistics", () => {
    boardState = ["hello", "share", ...boardState];

    const gameState = {
      boardState,
      lastCompletedTs: new Date().valueOf(),
      scores,
      status: GameStatus.Win,
    };

    expect(calculateStatistics(stats, gameState)).toEqual({
      currentStreak: 1,
      maxStreak: 1,
      played: 1,
      winPercentage: 100,
      guessDistribution: {
        1: 0,
        2: 1,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        fail: 0,
      },
    });
  });

  it("returns an object with the statistics", () => {
    boardState = ["hello", "share", "fails", "shoot", "feels", "wrong"];

    const gameState = {
      boardState,
      lastCompletedTs: new Date().valueOf(),
      scores,
      status: GameStatus.Lose,
    };

    expect(calculateStatistics(stats, gameState)).toEqual({
      currentStreak: 1,
      maxStreak: 1,
      played: 1,
      winPercentage: 0,
      guessDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        fail: 1,
      },
    });
  });

  it("returns an object with the statistics", () => {
    boardState = ["hello", "share", "fails", "shoot", "feels", "wrong"];

    const gameState = {
      boardState,
      lastCompletedTs: new Date().valueOf(),
      scores,
      status: GameStatus.Win,
    };

    expect(calculateStatistics(stats, gameState)).toEqual({
      currentStreak: 1,
      maxStreak: 1,
      played: 1,
      winPercentage: 100,
      guessDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 1,
        fail: 0,
      },
    });
  });
});

describe("calculateStreaks", () => {
  describe("currentStreak", () => {
    it("returns 0 when last completed timestamp exceeds 24 hours", () => {
      const dt = new Date();
      const twoDaysAgo = dt.setDate(dt.getDate() - 48);
      expect(calculateStreaks(3, 2, twoDaysAgo).currentStreak).toEqual(0);
    });

    it("returns increments when last completed timestamp is within 24 hours", () => {
      expect(
        calculateStreaks(3, 2, new Date().valueOf()).currentStreak
      ).toEqual(4);
    });
  });

  describe("maxStreak", () => {
    it("returns previous max streak value when current streak value is not greatest", () => {
      expect(calculateStreaks(3, 5, new Date().valueOf()).maxStreak).toEqual(5);
    });

    it("returns current streak value when previous max streak value is not greatest", () => {
      expect(calculateStreaks(7, 5, new Date().valueOf()).maxStreak).toEqual(8);
    });
  });
});

describe("calculateWinPercentage", () => {
  it("returns 0 when there are no previous plays or wins", () => {
    expect(calculateWinPercentage()).toEqual(0);
  });

  it("returns a whole number", () => {
    expect(calculateWinPercentage(15, 14)).toEqual(93);
  });
});

describe("incrementGamesPlayed", () => {
  it("defaults to 0 games played when there are no previously plays", () => {
    expect(incrementGamesPlayed()).toEqual(1);
  });

  it("increments previous games played by one", () => {
    expect(incrementGamesPlayed(15)).toEqual(16);
  });
});

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

describe("mapGuessDistribution", () => {
  it("maps the distribution correctly", () => {
    const prevDist = defaultGuessDistribution();
    expect(mapGuessDistribution(1, 3, prevDist)[3]).toEqual(1);
  });

  it("maps the distribution correctly", () => {
    const prevDist = defaultGuessDistribution();
    prevDist[2] = 1;
    expect(mapGuessDistribution(1, 2, prevDist)[2]).toEqual(2);
  });

  it("maps the distribution correctly when player loses", () => {
    const prevDist = defaultGuessDistribution();
    prevDist.fail = 4;
    expect(mapGuessDistribution(2, 6, prevDist).fail).toEqual(5);
    expect(mapGuessDistribution(2, 6, prevDist)[6]).toEqual(0);
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
