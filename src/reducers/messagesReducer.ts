export const REMOVE_GAME_OVER = "REMOVE_GAME_OVER";
export const REMOVE_SUBMISSION_ERROR = "REMOVE_SUBMISSION_ERROR";
export const SET_GAME_OVER = "SET_GAME_OVER";
export const SET_SUBMISSION_ERROR = "SET_SUBMISSION_ERROR";

export function messagesReducer(state: any, action: any) {
  const { submissionErrors } = state;

  switch (action.type) {
    case REMOVE_GAME_OVER:
      return {
        ...state,
        gameOverMsg: "",
      };
    case REMOVE_SUBMISSION_ERROR:
      return {
        ...state,
        submissionErrors: submissionErrors.slice(1),
      };
    case SET_GAME_OVER:
      return {
        ...state,
        gameOverMsg: action.payload,
      };
    case SET_SUBMISSION_ERROR:
      return {
        ...state,
        submissionErrors: [...submissionErrors, action.payload],
      };
    default:
      return state;
  }
}
