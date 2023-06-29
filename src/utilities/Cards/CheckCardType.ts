import {
  AiringSchedule,
  MainCard,
  NewEpisodeCards,
} from "../../interfaces/apiResponseTypes";

export const isMainCard = (arr: object | undefined): arr is MainCard[] =>
  arr && Array.isArray(arr) && arr.length ? "popularity" in arr[0] : false;

export const isNewEpisodeCards = (
  arr: (NewEpisodeCards | MainCard | AiringSchedule)[] | undefined
): arr is NewEpisodeCards[] =>
  arr && arr.length ? "nextAiringEpisode" in arr[0] : false;

export const isAiringSchedule = (
  arr: (NewEpisodeCards | MainCard | AiringSchedule)[] | undefined
): arr is AiringSchedule[] =>
  arr && Array.isArray(arr) && arr.length && "media" in arr[0] ? true : false;
