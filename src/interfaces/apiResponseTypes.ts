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
  season: Seasons;
  seasonYear: number;
  hasNextPage: boolean;
};

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
export type Seasons = "WINTER" | "SPRING" | "FALL" | "SUMMER";

export interface MainCard {
  meanScore: number | null;
  nextAiringEpisode: NextAiringEpisode | null;
  genres: string[];
  id: number | null;
  status: string | null;
  season: Seasons;
  type: string | null;
  trending: number | null;
  seasonYear: number | null;
  coverImage: CoverImage;
  title: Titles;
  studios: { nodes: StudioNode[] | null };
}
