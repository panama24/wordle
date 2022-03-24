import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Grid, { BoardState, Scores } from "./components/Grid";
import Keyboard from "./components/Keyboard";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import { BACKSPACE, ENTER, MAX_GUESSES, MAX_WORD_LENGTH } from "./constants";
import {
  hasWon,
  isValidGuess,
  mapKeyboardScores,
  scoreWord,
  wordForTheWinner,
  wordOfTheDay,
} from "./words/utils";

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
  const [gameOverMsg, setGameOverMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [keyboardState, setKeyboardState] = useState<
    Record<string, string | undefined>
  >({});

  const onEnter = useCallback(() => {
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

        const nextKeyboardState = mapKeyboardScores(boardState, wordOfTheDay);
        setKeyboardState(nextKeyboardState);

        if (hasWon(score)) {
          setGameStatus(GameStatus.Win);
          setGameOverMsg(wordForTheWinner);
          scheduleDismiss();
          return;
        }

        const nextRow = activeRow + 1;
        if (nextRow > MAX_GUESSES - 1) {
          setGameStatus(GameStatus.Lose);
          setGameOverMsg(wordOfTheDay);
          scheduleDismiss();
          return;
        } else {
          setActiveRow(nextRow);
        }
      } else {
        setSubmissionErrors([...submissionErrors, "Not in word list."]);
        scheduleDismiss();
      }
    }
  }, [activeRow, boardState, scores, submissionErrors]);

  const onDelete = useCallback(() => {
    setBoardState([
      ...boardState.slice(0, activeRow),
      boardState[activeRow].slice(0, -1),
      ...boardState.slice(activeRow + 1),
    ]);
  }, [activeRow, boardState]);

  const onCharKey = useCallback(
    (key) => {
      if (boardState[activeRow].length < MAX_WORD_LENGTH) {
        setBoardState([
          ...boardState.slice(0, activeRow),
          (boardState[activeRow] += key),
          ...boardState.slice(activeRow + 1),
        ]);
      }
    },
    [activeRow, boardState]
  );

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (gameStatus !== GameStatus.InProgress) return;

      if (!event.metaKey) {
        if (event.key === ENTER) {
          onEnter();
        } else if (event.key === BACKSPACE) {
          onDelete();
        } else if (/^[a-zA-Z]{1}$/.test(event.key)) {
          onCharKey(event.key);
        }
      }
    },
    [gameStatus, onCharKey, onDelete, onEnter]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  useEffect(() => {
    if (gameStatus !== GameStatus.InProgress) {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 2100);
    }
  }, [gameStatus]);

  const scheduleDismiss = () => {
    setTimeout(() => {
      setSubmissionErrors((errors) => [...errors.slice(1)]);
      setGameOverMsg(null);
    }, 2000);
  };

  console.log(wordOfTheDay);
  return (
    <>
      <GridLayout>
        <Grid state={boardState} scores={scores} />
      </GridLayout>
      <Keyboard
        onCharKey={onCharKey}
        onDelete={onDelete}
        onEnter={onEnter}
        state={keyboardState}
      />
      <ToastLayout>
        {gameOverMsg && <Toast content={gameOverMsg} />}
        {submissionErrors?.map((error, i) => (
          <Toast key={i} content={error} />
        ))}
      </ToastLayout>
      <Modal close={() => setIsModalOpen(false)} isOpen={isModalOpen}>
        <div>STATISTICS</div>
        <div style={{ display: "flex" }}>
          <div>Played</div>
          <div>Win %</div>
          <div>Current Streak</div>
          <div>Max Streak</div>
        </div>
        <div>GUESS DISTRIBUTION</div>
        <div>BAR CHART</div>
        <div>NEXT WORDLE</div>
        <div style={{ display: "flex" }}>
          <div>HH:MM:SS</div>
          <div>|</div>
          <div>Share</div>
        </div>
      </Modal>
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
