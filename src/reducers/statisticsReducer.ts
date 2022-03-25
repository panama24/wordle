import { Statistics } from "../constants";

type Action = any;

export const SET_STATISTICS = "SET_STATISTICS";

export function statisticsReducer(state: Statistics, action: Action) {
  switch (action.type) {
    case SET_STATISTICS:
      return action.payload;
    default:
      return state;
  }
}
