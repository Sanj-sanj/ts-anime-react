export interface APIVariables {
  page: number;
  perPage: number;
  season: Seasons;
  seasonYear: number;
  hasNextPage: boolean;
}

type Seasons = "WINTER" | "SPRING" | "FALL" | "SUMMER";
