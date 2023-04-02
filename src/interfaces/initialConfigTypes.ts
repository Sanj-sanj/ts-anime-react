import { APIVariables } from "./apiResponseTypes";
import { MainCard } from "./apiResponseTypes";

type SeasonYear<Year extends number> = {
  [Y in Year]: MainCard[];
};

export type InitialConfig = {
  variables: APIVariables;
  nextPageAvailable: boolean;
  cards: {
    WINTER: SeasonYear<number>;
    SPRING: SeasonYear<number>;
    SUMMER: SeasonYear<number>;
    FALL: SeasonYear<number>;
  };
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
