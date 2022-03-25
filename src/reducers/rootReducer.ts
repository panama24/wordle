import { gameStateReducer } from "./gameStateReducer";
import { messagesReducer } from "./messagesReducer";
import { statisticsReducer } from "./statisticsReducer";

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
