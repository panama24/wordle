import { gameStateReducer } from "./gameStateReducer";
import { messagesReducer } from "./messagesReducer";
import { statisticsReducer } from "./statisticsReducer";
import { GameStatus } from "../constants";
import {
  defaultGuessDistribution,
  initialBoardState,
  initialScores,
} from "../words/utils";

export const initialState = {
  gameState: {
    activeRow: 0,
    boardState: initialBoardState(),
    lastCompletedTs: 0,
    lastPlayedTs: 0,
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

const combineReducers = (slices: any) => (state: any, action: any) => {
  return Object.keys(slices).reduce(
    (acc, prop) => ({
      ...acc,
      [prop]: slices[prop](acc[prop], action),
    }),
    state
  );
};

export const rootReducer = combineReducers({
  gameState: gameStateReducer,
  messages: messagesReducer,
  statistics: statisticsReducer,
});
