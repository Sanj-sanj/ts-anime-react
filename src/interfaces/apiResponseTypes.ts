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
};
type Formats = ["TV", "TV_SHORT"] | ["MOVIE", "SPECIAL"] | ["ONA", "OVA"];

type StudioNode = {
  name: string;
  isAnimationStudio: boolean;
  favourites: number;
};

type NextAiringEpisode = {
  airingAt: number;
  episode: number;
  timeUntilAiring: number;
};

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

export interface MainCard {
  meanScore: number | null;
  nextAiringEpisode: NextAiringEpisode | null;
  genres: string[];
  format: string;
  id: number | null;
  status:
    | "FINISHED"
    | "RELEASING"
    | "NOT_YET_RELEASED"
    | "CANCELED"
    | "HIATUS"
    | null;
  season: Season;
  type: string | null;
  trending: number | null;
  seasonYear: number | null;
  coverImage: CoverImage;
  title: Titles;
  studios: { nodes: StudioNode[] | null };
}
