import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import {
  BACKSPACE,
  BoardState,
  ENTER,
  GameState,
  GameStatus,
  LOCAL_STORAGE_STATE_KEY,
  LOCAL_STORAGE_STATS_KEY,
  MAX_GUESSES,
  MAX_WORD_LENGTH,
  Scores,
  Statistics,
} from "./constants";
import {
  calculateStatistics,
  defaultGuessDistribution,
  hasWon,
  initialBoardState,
  initialScores,
  isValidGuess,
  mapKeyboardScores,
  scoreWord,
  wordForTheWinner,
  wordOfTheDay,
} from "./words/utils";

function App() {
  const [activeRow, setActiveRow] = useState<number>(0);
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState());
  const [scores, setScores] = useState<Scores>(initialScores());
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.InProgress
  );
  const [statistics, setStatistics] = useState<Statistics>();
  const [submissionErrors, setSubmissionErrors] = useState<
    (string | undefined)[]
  >([]);
  const [gameOverMsg, setGameOverMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [keyboardState, setKeyboardState] = useState<
    Record<string, string | undefined>
  >({});

  const persistStats = useCallback(() => {
    let lastCompletedTs = 0;
    const stateFromStorage = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
    if (stateFromStorage) {
      lastCompletedTs = JSON.parse(stateFromStorage).lastCompletedTs;
    }
    const gameState: GameState = {
      activeRow,
      boardState,
      lastCompletedTs,
      status: gameStatus,
      scores,
    };

    let stats: Statistics = {
      currentStreak: 0,
      maxStreak: 0,
      played: 0,
      winPercentage: 0,
      guessDistribution: defaultGuessDistribution(),
    };
    const statsFromStorage = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
    if (statsFromStorage) {
      stats = JSON.parse(statsFromStorage);
    }

    const nextStats = calculateStatistics(gameState, stats);
    setStatistics(nextStats);
    localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(nextStats));

    const nextGameState = {
      ...gameState,
      lastCompletedTs: new Date().valueOf(),
    };
    localStorage.setItem(
      LOCAL_STORAGE_STATE_KEY,
      JSON.stringify(nextGameState)
    );
  }, [activeRow, boardState, gameStatus, scores]);

  const onEnter = useCallback(() => {
    if (boardState[activeRow].length < MAX_WORD_LENGTH) {
      setSubmissionErrors([...submissionErrors, "Not enough letters."]);
      scheduleDismiss();
    } else {
      if (isValidGuess(boardState[activeRow])) {
        const score = scoreWord(boardState[activeRow], wordOfTheDay);
        const nextScores = [
          ...scores.slice(0, activeRow),
          score,
          ...scores.slice(activeRow + 1),
        ];
        setScores(nextScores);

        const nextKeyboardState = mapKeyboardScores(boardState, wordOfTheDay);
        setKeyboardState(nextKeyboardState);

        const nextRow = activeRow + 1;

        let lastCompletedTs = 0;
        const stateFromStorage = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
        if (stateFromStorage) {
          lastCompletedTs = JSON.parse(stateFromStorage).lastCompletedTs;
        }
        localStorage.setItem(
          LOCAL_STORAGE_STATE_KEY,
          JSON.stringify({
            activeRow: nextRow,
            boardState,
            lastCompletedTs,
            status: gameStatus,
            scores: nextScores,
          })
        );

        if (nextRow > MAX_GUESSES - 1) {
          setGameStatus(GameStatus.Lose);
          setGameOverMsg(wordOfTheDay);
          scheduleDismiss();
          return;
        } else {
          setActiveRow(nextRow);
        }

        if (hasWon(score)) {
          setGameStatus(GameStatus.Win);
          setGameOverMsg(wordForTheWinner);
          scheduleDismiss();
          persistStats();
          return;
        }
      } else {
        setSubmissionErrors([...submissionErrors, "Not in word list."]);
        scheduleDismiss();
      }
    }
  }, [
    activeRow,
    boardState,
    gameStatus,
    persistStats,
    scores,
    submissionErrors,
  ]);

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
        {statistics && <Stats statistics={statistics} />}
      </Modal>
    </>
  );
}

type StatsProps = {
  statistics: Statistics;
};

function Stats({ statistics }: StatsProps) {
  return (
    <>
      <div>STATISTICS</div>
      <div style={{ display: "flex" }}>
        <div>Played {statistics.played}</div>
        <div>Win % {statistics.winPercentage}</div>
        <div>Current Streak: {statistics.currentStreak}</div>
        <div>Max Streak {statistics.maxStreak}</div>
      </div>
      <div>GUESS DISTRIBUTION</div>
      <div>BAR CHART</div>
      <div>NEXT WORDLE</div>
      <div style={{ display: "flex" }}>
        <div>HH:MM:SS</div>
        <div>|</div>
        <div>Share</div>
      </div>
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
