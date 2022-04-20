import { createContext } from "react";
import { APIVariables } from "../interfaces/apiRequestTypes";
import { InitialConfig } from "../interfaces/initialConfigTypes";

const apiVariables: APIVariables = {
  page: 1,
  perPage: 7,
  season: "WINTER",
  seasonYear: 2022,
  hasNextPage: true,
};

const initialConfig: InitialConfig = {
  variables: apiVariables,
  nextPageAvailable: true,
  isFetching: true,
  cards: [],
  dispatch: () => "v", //this probably isnt right way to initialize the dispatch
};

export const Initial = createContext(initialConfig);
