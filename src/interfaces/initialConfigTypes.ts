import { APIVariables } from "./apiResponseTypes";
import { MainCard } from "./apiResponseTypes";

export type InitialConfig = {
  variables: APIVariables;
  nextPageAvailable: boolean;
  cards: MainCard[];
};

//Type definitions for topReducer
type ActionTypes =
  | "UPDATE_VARIABLES"
  | "UPDATE_IS_FETCHING"
  | "UPDATE_NEXT_PAGE_AVAILABLE"
  | "UPDATE_CARDS";
type Payload = string | number | boolean | APIVariables | MainCard[];

export type Actions = {
  type: ActionTypes;
  payload: Payload;
};
