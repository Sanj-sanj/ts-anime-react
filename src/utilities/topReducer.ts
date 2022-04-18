import { APIVariables } from "../interfaces/apiRequestTypes";
import { MainCard } from "../interfaces/apiResponseTypes";
import { InitialConfig } from "../interfaces/initialConfigTypes";

type Payload = string | number | boolean | APIVariables | MainCard[];
type ActionTypes =
  | "UPDATE_VARIABLES"
  | "UPDATE_Y_POSITION"
  | "UPDATE_IS_FETCHING"
  | "UPDATE_NEXT_PAGE_AVAILABLE"
  | "UPDATE_INFO";

type Actions = {
  type: ActionTypes;
  payload: Payload;
};

const appReducer = (state: InitialConfig, action: Actions): InitialConfig => {
  switch (action.type) {
    case "UPDATE_VARIABLES":
      if (
        typeof action.payload === "object" &&
        "seasonYear" in action.payload
      ) {
        return { ...state, variables: action.payload };
      }
      return state;

    case "UPDATE_Y_POSITION":
      if (typeof action.payload === "number") {
        return { ...state, yScrollPosition: action.payload };
      }
      return state;

    case "UPDATE_IS_FETCHING":
      if (typeof action.payload === "boolean") {
        return { ...state, isFetching: action.payload };
      }
      return state;

    case "UPDATE_NEXT_PAGE_AVAILABLE":
      if (typeof action.payload === "boolean") {
        return { ...state, nextPageAvailable: action.payload };
      }
      return state;

    case "UPDATE_INFO":
      if (Array.isArray(action.payload)) {
        return { ...state, cards: action.payload };
      }
      return state;

    default:
      return state;
  }
};
export default appReducer;
