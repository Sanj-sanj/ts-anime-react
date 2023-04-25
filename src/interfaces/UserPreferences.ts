import { Season, Titles } from "./apiResponseTypes";

// NOTE: ShowListDetails & ListDetails may need to be reworked.

export type ListDetails = {
  id: number | null;
  season: Season | null;
  year: number | null;
  title: Titles | null;
  currentEpisode: number | null;
  userScore: number | null;
  startedOn: string | null;
  completedOn: string | null;
  notes: string | null;
};

export type ShowListDetails<id extends number> = {
  [n in id]: {
    id: n;
    season: Season;
    year: number;
    title: Titles;
    currentEpisode: number | null;
    userScore: number | null;
    startedOn: Date | null;
    completedOn: Date | null;
    notes: string | null;
  };
};

export type UserShowStatus =
  | "WATCHING"
  | "INTERESTED"
  | "COMPLETED"
  | "DROPPED"
  | "SKIPPED";
export interface UserPreferences {
  WATCHING: ShowListDetails<number>;
  INTERESTED: ShowListDetails<number>;
  COMPLETED: ShowListDetails<number>;
  DROPPED: ShowListDetails<number>;
  SKIPPED: ShowListDetails<number>;
}
