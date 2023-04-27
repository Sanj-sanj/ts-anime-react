import { ValidFormats } from "./initialConfigTypes";

export interface APIPayload {
  data: {
    Page: {
      media: MainCard[];
      pageInfo: {
        currentPage: number;
        hasNextPage: boolean;
        lastPage: number;
        perPage: number;
        total: number;
      };
    };
  };
}

export type APIVariables = {
  page: number;
  perPage: number;
  season: Season;
  seasonYear: number;
  hasNextPage: boolean;
  format_in: Formats;
  format: ValidFormats;
};
export type Formats =
  | ["TV", "TV_SHORT"]
  | ["MOVIE", "SPECIAL"]
  | ["ONA", "OVA"];

type StudioNode = {
  name: string;
  isAnimationStudio: boolean;
  favourites: number;
};

export type NextAiringEpisode = {
  airingAt: number;
  episode: number;
  timeUntilAiring: number;
} | null;

export type Titles = {
  romaji: string | null;
  english: string | null;
  native: string | null;
};
export type CoverImage = {
  color: string | null;
  large: string | null;
  medium: string | null;
};
export type Season = "WINTER" | "SPRING" | "SUMMER" | "FALL";
export type ShowStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELED"
  | "HIATUS"
  | null;
export interface MainCard {
  meanScore: number | null;
  nextAiringEpisode: NextAiringEpisode;
  genres: string[];
  id: number;
  status: ShowStatus;
  season: Season;
  type: string | null;
  trending: number | null;
  seasonYear: number | null;
  coverImage: CoverImage;
  title: Titles;
  studios: { nodes: StudioNode[] | null };
  format?: string;
  popularity?: number;
  episodes?: number;
  duration?: number;
  modNotes?: string;
  description?: string;
  source?: string;
}
