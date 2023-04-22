import { Season, Titles } from "./apiResponseTypes";

// NOTE: ShowListDetails & ListDetails may need to be reworked.

export type ListDetails = {
  id: number;
  season: Season;
  year: number | null;
  title: Titles;
  currentEpisode: number | null;
  userScore: number | null;
  startedOn: Date | null;
  completedOn: Date | null;
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
  watching: ShowListDetails<number>[];
  interested: ShowListDetails<number>[];
  completed: ShowListDetails<number>[];
  dropped: ShowListDetails<number>[];
  skipped: ShowListDetails<number>[];
}
