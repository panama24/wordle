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
  LOCAL_STORAGE_STATE_KEY,
  LOCAL_STORAGE_STATS_KEY,
  MAX_GUESSES,
  MAX_WORD_LENGTH,
  Scores,
  Statistics,
} from "./constants";
import {
  ADD_CHAR,
  DELETE_CHAR,
  INCREMENT_ROW,
  SET_GAME_STATUS,
  UPDATE_SCORES,
} from "./reducers/gameStateReducer";
import {
  REMOVE_GAME_OVER,
  REMOVE_SUBMISSION_ERROR,
  SET_GAME_OVER,
  SET_SUBMISSION_ERROR,
} from "./reducers/messagesReducer";
import { rootReducer } from "./reducers/rootReducer";
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

function tryReadLocalStorage() {
  let persistedState: any = {};
  try {
    const storedState = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
    if (storedState) {
      persistedState = JSON.parse(storedState);
    }
  } catch (error) {}
  return { ...initialState, ...persistedState };
}

const initialState = {
  gameState: {
    activeRow: 0,
    boardState: initialBoardState(),
    lastCompletedTs: 0,
    status: GameStatus.InProgress,
    scores: initialScores(),
  },
  messages: {
    submissionErrors: [],
    gameOverMsg: null,
  },
  statistics: {
    currentStreak: 0,
    maxStreak: 0,
    played: 0,
    winPercentage: 0,
    guessDistribution: defaultGuessDistribution(),
  },
};

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
  console.log("state", state);

  // called onEnter when gameStatus = WIN
  // const persistStats = useCallback(() => {
  //   // will this ever really not be set? -> win on first try?
  //   let lastCompletedTs = 0;
  //   const stateFromStorage = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
  //   if (stateFromStorage) {
  //     lastCompletedTs = JSON.parse(stateFromStorage).lastCompletedTs;
  //   }
  //   // with useReducer --> state.gameState;
  //   const gameState: GameState = {
  //     activeRow,
  //     boardState,
  //     // how do we handle this?
  //     lastCompletedTs,
  //     status: gameStatus,
  //     scores,
  //   };

  //   let stats: Statistics = {
  //     currentStreak: 0,
  //     maxStreak: 0,
  //     played: 0,
  //     winPercentage: 0,
  //     guessDistribution: defaultGuessDistribution(),
  //   };
  //   const statsFromStorage = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
  //   if (statsFromStorage) {
  //     stats = JSON.parse(statsFromStorage);
  //   }

  //   const nextStats = calculateStatistics(gameState, stats);
  //   // dispatch({ type: SET_STATISTICS, payload: nextStats })
  //   setStatistics(nextStats);

  //   // persisting will have to be done outside of reducer
  //   localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(nextStats));

  //   // const newTs = new Date().valueOf();
  //   // dispatch({ type: UPDATE_TIMESTAMP, payload: newTs })
  //   const nextGameState = {
  //     ...gameState,
  //     lastCompletedTs: new Date().valueOf(),
  //   };
  //   localStorage.setItem(
  //     LOCAL_STORAGE_STATE_KEY,
  //     JSON.stringify(nextGameState)
  //   );
  // }, [activeRow, boardState, gameStatus, scores]);

  const onEnter = useCallback(() => {
    const {
      gameState: { activeRow, boardState, scores },
    } = state;

    if (boardState[activeRow].length < MAX_WORD_LENGTH) {
      dispatchMsgAndScheduleDismiss(
        SET_SUBMISSION_ERROR,
        "Not enough letters."
      );
    } else {
      if (isValidGuess(boardState[activeRow])) {
        const score = scoreWord(boardState[activeRow], wordOfTheDay);
        dispatch({
          type: UPDATE_SCORES,
          payload: score,
        });

        setKeyboardState(mapKeyboardScores(boardState, wordOfTheDay));

        if (activeRow + 1 > MAX_GUESSES - 1) {
          dispatch({
            type: SET_GAME_STATUS,
            payload: GameStatus.Lose,
          });

          dispatchMsgAndScheduleDismiss(SET_GAME_OVER, wordOfTheDay);

          return;
        } else {
          dispatch({ type: INCREMENT_ROW });
        }

        if (hasWon(score)) {
          dispatch({
            type: SET_GAME_STATUS,
            payload: GameStatus.Win,
          });

          dispatchMsgAndScheduleDismiss(SET_GAME_OVER, wordForTheWinner);

          // persistStats();
          return;
        }
      } else {
        dispatchMsgAndScheduleDismiss(
          SET_SUBMISSION_ERROR,
          "Not in word list."
        );
      }

      // do we need lastPlayedTs?
      // let lastCompletedTs = 0;
      // const stateFromStorage = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
      // if (stateFromStorage) {
      //   lastCompletedTs = JSON.parse(stateFromStorage).lastCompletedTs;
      // }
      // // could this just be JSON.stringify(state.gameState) once we are using useReducer?
      // localStorage.setItem(
      //   LOCAL_STORAGE_STATE_KEY,
      //   JSON.stringify({
      //     activeRow,
      //     boardState,
      //     lastCompletedTs,
      //     status: gameStatus,
      //     scores,
      //   })
      // );
    }
  }, [state]);

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
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

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

  const dispatchMsgAndScheduleDismiss = useCallback(
    (type: string, payload?: any) => {
      dispatch({ type, payload });

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
      <Modal close={() => setIsModalOpen(false)} isOpen={isModalOpen}>
        <Stats statistics={state.statistics} />
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
  statistics: Statistics;
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
