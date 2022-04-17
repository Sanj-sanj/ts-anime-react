export type APIPayload = {
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

type Titles = {
  romaji: string | null;
  english: string | null;
  native: string | null;
};
export type CoverImage = {
  color: string | null;
  large: string | null;
  medium: string | null;
};

export type MainCard = {
  meanScore: number | null;
  nextAiringEpisode: NextAiringEpisode | null;
  genres: string[];
  id: number | null;
  status: string | null;
  season: string | null;
  type: string | null;
  trending: number | null;
  seasonYear: number | null;
  coverImage: CoverImage;
  title: Titles;
  studios: { nodes: StudioNode[] | null };
};
