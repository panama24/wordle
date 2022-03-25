import { initialState } from "./reducers/rootReducer";

export const LOCAL_STORAGE_STATS_KEY = "wordle-clone-stats";
export const LOCAL_STORAGE_STATE_KEY = "wordle-clone-game-state";

export function tryReadLocalStorage() {
  let persistedState: any = {};
  let persistedStats: any = {};
  try {
    const storedStats = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
    if (storedStats) {
      persistedStats = JSON.parse(storedStats);
    }
    const storedState = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
    if (storedState) {
      persistedState = JSON.parse(storedState);
    }
  } catch (error) {}

  return {
    ...initialState,
    gameState: {
      ...initialState.gameState,
      ...persistedState,
    },
    statistics: {
      ...initialState.statistics,
      ...persistedStats,
    },
  };
}
