import { APIVariables } from "../interfaces/apiRequestTypes";
import { MainCard } from "./apiResponseTypes";

export type InitialConfig = {
  variables: APIVariables;
  nextPageAvailable: boolean;
  isFetching: boolean;
  yScrollPosition: number;
  cards: MainCard[];
};
