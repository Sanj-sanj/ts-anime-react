import { APIVariables } from "../interfaces/apiResponseTypes";
import { InitialConfig } from "../interfaces/initialConfigTypes";
import { UserPreferences } from "../interfaces/UserPreferencesTypes";
import getCurrSeasonAndYear from "./getCurrentSeasonAndYear";

const [season, seasonYear] = getCurrSeasonAndYear();

const apiVariables: APIVariables = {
  page: 1,
  perPage: 50,
  season: undefined,
  seasonYear: undefined,
  status_in: "RELEASING",
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

//tbc: work on APIVarialbe to accept the Ongoing type into variables without breakign anything

export const Initial: InitialConfig = {
  variables: apiVariables,
  client: {
    nextPageAvailable: true,
    startIndex: 0,
    perPage: 15,
    season,
    seasonYear,
    showOngoing: true,
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
  cards: {
    WINTER: [],
    SPRING: [],
    SUMMER: [],
    FALL: [],
    ONGOING: { MOVIE: [], OVA: [], TV: [] },
  },
  sort: "Rating",
};
