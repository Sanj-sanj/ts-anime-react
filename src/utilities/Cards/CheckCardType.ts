import { MainCard, NewEpisodeCards } from "../../interfaces/apiResponseTypes";

export const isMainCard = (
  arr: (NewEpisodeCards | MainCard)[] | undefined
): arr is MainCard[] => (arr && arr.length ? "popularity" in arr[0] : false);

export const isNewEpisodeCards = (
  arr: (NewEpisodeCards | MainCard)[] | undefined
): arr is NewEpisodeCards[] =>
  arr && arr.length ? "nextAiringEpisode" in arr[0] : false;
