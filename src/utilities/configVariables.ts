import { APIVariables, Season } from "../interfaces/apiResponseTypes";
import { InitialConfig } from "../interfaces/initialConfigTypes";

const getCurrSeasonAndYear = (): [Season, number] => {
  //load this function on initial load to get nearest season & year
  const today = new Date();
  const seasons: Season[] = ["WINTER", "SPRING", "SUMMER", "FALL"];
  const thisSeason: Season = seasons[Math.round((today.getMonth() + 1) / 4)];
  const thisYear = today.getFullYear();
  return [thisSeason, thisYear];
};

const [thisSeason, thisYear] = getCurrSeasonAndYear();

const apiVariables: APIVariables = {
  page: 1,
  perPage: 14,
  season: thisSeason,
  seasonYear: thisYear,
  hasNextPage: true,
  format_in: ["TV", "TV_SHORT"],
};

export const Initial: InitialConfig = {
  variables: apiVariables,
  nextPageAvailable: true,
  cards: { WINTER: [], SPRING: [], SUMMER: [], FALL: [] },
};
