import dayjs from "dayjs";
import {
  Season,
  ShowStatus,
  StudioNode,
} from "../../interfaces/apiResponseTypes";

export function formattedStartDate(
  startDate:
    | {
        day: number | null;
        month: number;
        year: number;
      }
    | undefined,
  season: Season
) {
  return (
    (startDate?.day &&
      dayjs(`${startDate.year}-${startDate.month}-${startDate.day}`).format(
        "MMMM DD, YYYY"
      )) ||
    (startDate?.month &&
      dayjs(`${startDate?.year}-${startDate.month}`).format("MMMM YYYY")) ||
    `${season.slice(0, 1)}${season.slice(1).toLowerCase()}, ${
      startDate?.year || ""
    }` ||
    "No info"
  );
}

export function formatStudiosText(studios: StudioNode[] | null) {
  if (!studios) return "No info";
  return (
    studios.find((studio) => studio.isAnimationStudio)?.name ||
    studios.find((studio) => !studio.isAnimationStudio)?.name ||
    "Unknown"
  );
}

export function formattedGenresText(genres: string[], limit?: number) {
  return genres.slice(0, limit);
}

export function formattedStatusText(status: ShowStatus) {
  const dict = {
    FINISHED: "Finished Airing",
    RELEASING: "Currently Airing",
    NOT_YET_RELEASED: "Unreleased",
    CANCELED: "Canceled",
    HIATUS: "Hiatus",
  };
  if (!status) return "Unknown";
  return dict[status];
}
