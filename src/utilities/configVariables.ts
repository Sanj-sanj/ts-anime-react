import dayjs from "dayjs";
import { APIVariables } from "../interfaces/apiResponseTypes";
import { InitialConfig } from "../interfaces/initialConfigTypes";
import { UserPreferences } from "../interfaces/UserPreferencesTypes";
import getCurrSeasonAndYear from "./getCurrentSeasonAndYear";

const [season, seasonYear] = getCurrSeasonAndYear();

const apiVariables: APIVariables = {
  page: 1,
  perPage: 50,
  season: season,
  seasonYear: seasonYear,
  status_in: undefined,
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
  variables: apiVariables, // THIS MUTATES LIKE CRAZY OH MY GOD WHY HAVE I DONE THIS
  client: {
    perPage: 15,
    season,
    seasonYear,
    titlesLang:
      (localStorage.getItem("titlePref") as "english" | "romaji") || "english",
    sort: "Rating",
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
    WINTER: {},
    SPRING: {},
    SUMMER: {},
    FALL: {},
    ONGOING: { MOVIE: [], OVA: [], TV: [] },
    CALENDAR: {
      SHOWS: [],
      LAST_CALLED: dayjs()
    }
  },
};
