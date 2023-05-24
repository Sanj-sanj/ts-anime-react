import { APIVariables } from "../interfaces/apiResponseTypes";
import { InitialConfig } from "../interfaces/initialConfigTypes";
import { UserPreferences } from "../interfaces/UserPreferencesTypes";
import getCurrSeasonAndYear from "./getCurrentSeasonAndYear";

const [thisSeason, thisYear] = getCurrSeasonAndYear();

const apiVariables: APIVariables = {
  page: 1,
  perPage: 50,
  season: thisSeason,
  seasonYear: thisYear,
  hasNextPage: true,
  format_in: ["TV", "TV_SHORT"],
  format: "TV",
};

const UserPreferences: UserPreferences = {
  WATCHING: {},
  INTERESTED: {},
  COMPLETED: {},
  DROPPED: {},
  SKIPPED: {},
};

export const Initial: InitialConfig = {
  variables: apiVariables,
  client: {
    nextPageAvailable: true,
    startIndex: 0,
    perPage: 15,
    overlay: {
      modal: { active: false, entryPoint: undefined },
      navigation: { active: false },
    },
  },
  user: {
    lists: UserPreferences,
    newEpisodesAvailable: [],
    modalData: undefined,
  },
  cards: { WINTER: [], SPRING: [], SUMMER: [], FALL: [] },
  sort: "Rating",
};
