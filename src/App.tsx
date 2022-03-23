import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Grid, { BoardState, Scores } from "./components/Grid";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import { MAX_GUESSES, MAX_WORD_LENGTH } from "./constants";
import { hasWon, isValidGuess, scoreWord, wordOfTheDay } from "./words/utils";

const initialBoardState: BoardState = ["", "", "", "", "", ""];

const initialScores: Scores = [...Array(MAX_GUESSES)].map((_) =>
  Array(MAX_WORD_LENGTH).fill(null)
);

enum GameStatus {
  InProgress,
  Win,
  Lose,
}

function App() {
  const [activeRow, setActiveRow] = useState<number>(0);
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [scores, setScores] = useState<Scores>(initialScores);
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.InProgress
  );
  const [submissionErrors, setSubmissionErrors] = useState<
    (string | undefined)[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (gameStatus !== GameStatus.InProgress) return;

      if (!event.metaKey) {
        if (event.key === "Enter") {
          if (boardState[activeRow].length < MAX_WORD_LENGTH) {
            setSubmissionErrors([...submissionErrors, "Not enough letters."]);
            scheduleDismiss();
          } else {
            if (isValidGuess(boardState[activeRow])) {
              const score = scoreWord(boardState[activeRow], wordOfTheDay);
              setScores([
                ...scores.slice(0, activeRow),
                score,
                ...scores.slice(activeRow + 1),
              ]);

              if (hasWon(score)) {
                setGameStatus(GameStatus.Win);
                return;
              }

              const nextRow = activeRow + 1;
              if (nextRow > MAX_GUESSES - 1) {
                setGameStatus(GameStatus.Lose);
                return;
              } else {
                setActiveRow(nextRow);
              }
            } else {
              setSubmissionErrors([...submissionErrors, "Not in word list."]);
              scheduleDismiss();
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
    [activeRow, boardState, gameStatus, scores, submissionErrors]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  useEffect(() => {
    if (gameStatus !== GameStatus.InProgress) {
      setIsModalOpen(true);
    }
  }, [gameStatus]);

  const scheduleDismiss = () => {
    setTimeout(() => {
      setSubmissionErrors((errors) => [...errors.slice(1)]);
    }, 2000);
  };

  return (
    <>
      <GridLayout>
        <Grid state={boardState} scores={scores} />
      </GridLayout>
      <ToastLayout>
        {submissionErrors?.map((error, i) => (
          <Toast key={i} content={error} />
        ))}
      </ToastLayout>
      <Modal
        content={"i am content"}
        close={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />
    </>
  );
}

const GridLayout = styled.div`
  display: inline-block;
`;

const ToastLayout = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
`;

export default App;
