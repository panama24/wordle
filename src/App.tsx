import { useCallback, useEffect, useReducer, useState } from "react";
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
  MAX_GUESSES,
  MAX_WORD_LENGTH,
  Scores,
  Statistics,
} from "./constants";
import { usePrevious } from "./hooks/usePrevious";
import {
  LOCAL_STORAGE_STATE_KEY,
  LOCAL_STORAGE_STATS_KEY,
  tryReadLocalStorage,
} from "./localStorage";
import {
  ADD_CHAR,
  DELETE_CHAR,
  INCREMENT_ROW,
  RESET,
  SET_GAME_STATUS,
  UPDATE_SCORES,
} from "./reducers/gameStateReducer";
import {
  REMOVE_GAME_OVER,
  REMOVE_SUBMISSION_ERROR,
  SET_GAME_OVER,
  SET_SUBMISSION_ERROR,
} from "./reducers/messagesReducer";
import { initialState, rootReducer } from "./reducers/rootReducer";
import {
  calculateStatistics,
  hasWon,
  initialBoardState,
  initialScores,
  INVALID_WORD_ERROR,
  isEmpty,
  isValidGuess,
  mapKeyboardScores,
  MIN_WORD_LENGTH_ERROR,
  scoreWord,
  wordForTheWinner,
  wordOfTheDay,
} from "./words/utils";

function App() {
  const [state, dispatch] = useReducer(
    rootReducer,
    initialState,
    tryReadLocalStorage
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [keyboardState, setKeyboardState] = useState<
    Record<string, string | undefined>
  >({});
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameStats, setGameStats] = useState<Statistics>();
  console.log("STATE", state);

  const dispatchMsgAndScheduleDismiss = useCallback(
    (type: string, payload?: any) => {
      dispatch({
        type,
        payload,
      });

      let removeType: string;
      if (type === SET_SUBMISSION_ERROR) {
        removeType = REMOVE_SUBMISSION_ERROR;
      } else {
        removeType = REMOVE_GAME_OVER;
      }

      setTimeout(() => {
        dispatch({ type: removeType });
      }, 2000);
    },
    []
  );

  const onEnter = useCallback(() => {
    const {
      gameState: { activeRow, boardState },
    } = state;

    if (boardState[activeRow].length < MAX_WORD_LENGTH) {
      dispatchMsgAndScheduleDismiss(
        SET_SUBMISSION_ERROR,
        MIN_WORD_LENGTH_ERROR
      );
      return;
    }

    if (!isValidGuess(boardState[activeRow])) {
      dispatchMsgAndScheduleDismiss(SET_SUBMISSION_ERROR, INVALID_WORD_ERROR);
      return;
    }

    const score = scoreWord(boardState[activeRow], wordOfTheDay);
    dispatch({
      type: UPDATE_SCORES,
      payload: score,
    });

    setKeyboardState(mapKeyboardScores(boardState, wordOfTheDay));

    dispatch({ type: INCREMENT_ROW });

    let gameOver = false;

    if (activeRow + 1 > MAX_GUESSES - 1) {
      gameOver = true;
      dispatch({
        type: SET_GAME_STATUS,
        payload: GameStatus.Lose,
      });
      dispatchMsgAndScheduleDismiss(SET_GAME_OVER, wordOfTheDay);
    }

    if (hasWon(score)) {
      gameOver = true;
      dispatch({
        type: SET_GAME_STATUS,
        payload: GameStatus.Win,
      });
      dispatchMsgAndScheduleDismiss(SET_GAME_OVER, wordForTheWinner);
    }

    setIsGameOver(gameOver);
  }, [dispatchMsgAndScheduleDismiss, state]);

  const onDelete = useCallback(() => dispatch({ type: DELETE_CHAR }), []);

  const onCharKey = useCallback(
    (key) =>
      dispatch({
        type: ADD_CHAR,
        payload: key,
      }),
    []
  );

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      const {
        gameState: { status },
      } = state;

      if (status !== GameStatus.InProgress) return;

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
    [onCharKey, onDelete, onEnter, state]
  );

  useEffect(() => {
    const { gameState, statistics } = state;
    if (
      gameState.status === GameStatus.Win ||
      gameState.status === GameStatus.Lose
    ) {
      const nextStats = calculateStatistics(gameState, statistics);
      localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(nextStats));
      setGameStats(nextStats);
    }
  }, [state]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  const previousScores = usePrevious(state.gameState.scores);
  useEffect(() => {
    const { gameState } = state;

    if (gameState.scores !== previousScores) {
      if (isEmpty(gameState.scores)) return;
      localStorage.setItem(
        LOCAL_STORAGE_STATE_KEY,
        JSON.stringify({
          ...gameState,
          lastPlayedTs: new Date().valueOf(),
        })
      );
    }
  }, [previousScores, state]);

  useEffect(() => {
    const { gameState } = state;

    if (isGameOver) {
      const now = new Date().valueOf();
      localStorage.setItem(
        LOCAL_STORAGE_STATE_KEY,
        JSON.stringify({
          ...gameState,
          lastCompletedTs: now,
          lastPlayedTs: now,
        })
      );
    }
  }, [isGameOver, state]);

  useEffect(() => {
    const {
      gameState: { status },
    } = state;
    if (status !== GameStatus.InProgress) {
      setTimeout(() => {
        // dispatch({ type: OPEN_MODAL })
        setIsModalOpen(true);
      }, 2100);
    }
  }, [state]);

  const onReset = (event: any) => {
    event.preventDefault();

    const storedState = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);

    if (storedState) {
      const newGameState = {
        ...JSON.parse(storedState),
        boardState: initialBoardState(),
        scores: initialScores(),
        status: GameStatus.InProgress,
        activeRow: 0,
      };

      localStorage.setItem(
        LOCAL_STORAGE_STATE_KEY,
        JSON.stringify(newGameState)
      );

      dispatch({
        type: RESET,
        payload: newGameState,
      });

      setKeyboardState({});
      setIsModalOpen(false);
    }
  };

  console.log(wordOfTheDay);
  return (
    <>
      <GridLayout>
        <Grid state={state} />
      </GridLayout>
      <Keyboard
        onCharKey={onCharKey}
        onDelete={onDelete}
        onEnter={onEnter}
        state={keyboardState}
      />
      <Toasts messages={state.messages} />
      <Modal
        close={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        reset={onReset}>
        <Stats statistics={gameStats} />
      </Modal>
    </>
  );
}

type ToastsProps = any;

function Toasts({ messages }: ToastsProps) {
  const { gameOverMsg, submissionErrors } = messages;
  return (
    <ToastLayout>
      {gameOverMsg && <Toast content={gameOverMsg} />}
      {submissionErrors?.map((error: any, i: number) => (
        <Toast key={i} content={error} />
      ))}
    </ToastLayout>
  );
}

type StatsProps = {
  statistics?: Statistics;
};

function Stats({ statistics }: StatsProps) {
  if (statistics) {
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
  return null;
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
