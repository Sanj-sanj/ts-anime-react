import dayjs from "dayjs";
import { APIVariables, AiringSchedule, NewEpisodeCards } from "../interfaces/apiResponseTypes";
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
const prevCalendarStored = localStorage.getItem('calendarShows')
const prevCalledStored = localStorage.getItem('calendarLastCalled')
const prevUserListStored = localStorage.getItem('userList')

const prevNewEpisodesCalled = localStorage.getItem('newEpisodesLastCalled')
const prevNewEpisodesStored = localStorage.getItem('newEpisodes')


let prevCalendarItems: AiringSchedule[] = [] 
let prevCalendarCalled = undefined;
let prevNewEpisodes = undefined;
let prevUserList = undefined;

if(prevUserListStored)
  prevUserList = JSON.parse(prevUserListStored) as UserPreferences

if(prevNewEpisodesStored)
  prevNewEpisodes = JSON.parse(prevNewEpisodesStored) as NewEpisodeCards[]

if(prevCalendarStored)
    prevCalendarItems = JSON.parse(prevCalendarStored) as AiringSchedule[]
if(prevCalledStored) 
    prevCalendarCalled = dayjs(prevCalledStored)

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
    lists: prevUserList || UserPreferences,
    newEpisodesAvailable: {
      available: prevNewEpisodes,
      last_called: dayjs(prevNewEpisodesCalled) //undefined calls function normally as expected
    },
    modalData: undefined,
  },
  cards: {
    WINTER: {},
    SPRING: {},
    SUMMER: {},
    FALL: {},
    ONGOING: { MOVIE: [], OVA: [], TV: [] },
    CALENDAR: {
      SHOWS: prevCalendarItems,
      LAST_CALLED: prevCalendarCalled || dayjs(),
    }
  },
};
