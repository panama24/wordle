import { useCallback, useEffect, useState } from "react";
import Grid, { BoardState, Scores } from "./components/Grid";
import { MAX_GUESSES, MAX_WORD_LENGTH } from "./constants";
import { isValidGuess, scoreWord, wordOfTheDay } from "./words/utils";

const initialBoardState: BoardState = ["", "", "", "", "", ""];

const initialScores: Scores = [...Array(MAX_GUESSES)].map((_) =>
  Array(MAX_WORD_LENGTH).fill(null)
);

function App() {
  const [activeRow, setActiveRow] = useState<number>(0);
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [scores, setScores] = useState<Scores>(initialScores);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!event.metaKey) {
        if (event.key === "Enter") {
          if (boardState[activeRow].length < MAX_WORD_LENGTH) {
            setSubmissionError("Not enough letters.");
          } else {
            if (isValidGuess(boardState[activeRow])) {
              setScores([
                ...scores.slice(0, activeRow),
                scoreWord(boardState[activeRow], wordOfTheDay),
                ...scores.slice(activeRow + 1),
              ]);
              setActiveRow(activeRow + 1);
            } else {
              setSubmissionError("Not in word list.");
            }
          }
        } else if (event.key === "Backspace") {
          setBoardState([
            ...boardState.slice(0, activeRow),
            boardState[activeRow].slice(0, -1),
            ...boardState.slice(activeRow + 1),
          ]);
        } else if (/^[a-zA-Z]{1}$/.test(event.key)) {
          if (boardState[activeRow].length < MAX_WORD_LENGTH) {
            setBoardState([
              ...boardState.slice(0, activeRow),
              (boardState[activeRow] += event.key),
              ...boardState.slice(activeRow + 1),
            ]);
          }
        }
      }
    },
    [activeRow, boardState, scores]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  return (
    <div style={{ display: "inline-block" }}>
      <Grid state={boardState} scores={scores} />
    </div>
  );
}
export default App;
