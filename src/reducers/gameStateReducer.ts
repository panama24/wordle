import { GameState, MAX_WORD_LENGTH } from "../constants";

type Action = {
  type: string;
  payload?: any;
};

// put in a different reducer
export const CLOSE_MODAL = "CLOSE_MODAL";
export const OPEN_MODAL = "OPEN_MODAL";

export const ADD_CHAR = "ADD_CHAR";
export const DELETE_CHAR = "DELETE_CHAR";
export const INCREMENT_ROW = "INCREMENT_ROW";
export const SET_GAME_STATUS = "SET_GAME_STATUS";
export const SUBMIT_GUESS = "SUBMIT_GUESS";
export const UPDATE_SCORES = "UPDATE_SCORES";

export function gameStateReducer(state: any, action: Action) {
  const { activeRow, boardState, scores } = state;

  switch (action.type) {
    case ADD_CHAR:
      if (boardState[activeRow].length < MAX_WORD_LENGTH) {
        return {
          ...state,
          boardState: [
            ...boardState.slice(0, activeRow),
            boardState[activeRow] + action.payload,
            ...boardState.slice(activeRow + 1),
          ],
        };
      }

      return state;
    case CLOSE_MODAL:
      return {
        ...state,
        isModalOpen: false,
      };
    case DELETE_CHAR:
      return {
        ...state,
        boardState: [
          ...boardState.slice(0, activeRow),
          boardState[activeRow].slice(0, -1),
          ...boardState.slice(activeRow + 1),
        ],
      };
    case INCREMENT_ROW:
      return {
        ...state,
        activeRow: activeRow + 1,
      };
    case OPEN_MODAL:
      return {
        ...state,
        isModalOpen: true,
      };
    case SET_GAME_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case SUBMIT_GUESS:
      return state;
    case UPDATE_SCORES:
      return {
        ...state,
        scores: [
          ...scores.slice(0, activeRow),
          action.payload,
          ...scores.slice(activeRow + 1),
        ],
      };
    default:
      return state;
  }
}
