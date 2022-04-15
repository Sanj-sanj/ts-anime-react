export interface apiPayload {
  data: {
    Page: {
      media: mainCard[];
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

interface StudioNode {
  name: string;
  isAnimationStudio: boolean;
  favourites: number;
}

interface NextAiringEpisode {
  airingAt: number;
  episode: number;
  timeUntilAiring: number;
}

export type Titles = {
  romaji: string | null;
  english: string | null;
  native: string | null;
};

export interface mainCard {
  meanScore: number | null;
  nextAiringEpisode: NextAiringEpisode | null;
  genres: string[];
  id: number | null;
  status: string | null;
  season: string | null;
  type: string | null;
  trending: number | null;
  seasonYear: number | null;
  coverImage: {
    large: string | null;
    medium: string | null;
    color: string | null;
  };
  title: Titles;
  studios: { nodes: StudioNode[] | null };
}
