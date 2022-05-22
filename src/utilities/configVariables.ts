import { APIVariables } from "../interfaces/apiResponseTypes";
import { InitialConfig } from "../interfaces/initialConfigTypes";

const apiVariables: APIVariables = {
  page: 1,
  perPage: 14,
  season: "WINTER",
  seasonYear: 2022,
  hasNextPage: true,
};

export const Initial: InitialConfig = {
  variables: apiVariables,
  nextPageAvailable: true,
  cards: [],
};
