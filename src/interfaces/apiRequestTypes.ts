export interface APIVariables {
  page: number;
  perPage: number;
  season: Seasons;
  seasonYear: number;
}

type Seasons = "WINTER" | "SPRING" | "FALL" | "SUMMER";
