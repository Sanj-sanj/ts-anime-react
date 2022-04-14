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

export interface mainCard {
  meanScore: number;
  genres: string[];
  id: number;
  status: string;
  season: string;
  type: string;
  trending: number;
  seasonYear: number;
  coverImage: { large: string; medium: string; color: string };
  title: { romaji: string; english: string; native: string };
  studios: { nodes: StudioNode[] };
}
