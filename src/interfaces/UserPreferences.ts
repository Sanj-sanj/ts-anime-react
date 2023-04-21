import { Season, Titles } from "./apiResponseTypes";

type ShowListDetails<id extends number> = {
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

export interface UserPreferences {
  watching: ShowListDetails<number>[];
  interested: ShowListDetails<number>[];
  completed: ShowListDetails<number>[];
  dropped: ShowListDetails<number>[];
  skipped: ShowListDetails<number>[];
}
