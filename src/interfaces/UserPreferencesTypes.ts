import {
    Formats,
    MainCard,
    Season,
    ShowStatus,
    Titles
} from "./apiResponseTypes";

export type ListDetails = {
  id: number | undefined;
  season: Season | undefined;
  year: number | undefined;
  title: Titles | undefined;
  currentEpisode: number | undefined;
  userScore: number | undefined;
  rewatches: number | undefined;
  startedOn: string | undefined;
  completedOn: string | undefined;
  notes: string | undefined;
  showAiringStatus: ShowStatus;
  userStatus: UserShowStatus | "";
  format: Formats;
};

export type ShowListDetails<id extends number> = {
  [n in id]: ListDetails;
};

export type UserListDetails = {
  [name in UserShowStatus]: UserListWithResults[];
};

export type UserListWithResults = {
    userListDetails: ListDetails;
    apiResults: MainCard;
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
};
