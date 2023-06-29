import dayjs from "dayjs";
import { MainCard, Season } from "../../../interfaces/apiResponseTypes";
import {
  InitialConfig,
  ValidFormats,
} from "../../../interfaces/initialConfigTypes";
import { sortAndFilterCardsForView } from "../../../utilities/Cards/CardContainerUtils";

const OngoingToGroupedByDay = (
  { cards }: Pick<InitialConfig, "cards">,
  {
    season,
    format,
    seasonYear,
  }: { season: Season; format: ValidFormats; seasonYear: number },
  showOngoing: boolean
) => {
  const sortedByCountdown = sortAndFilterCardsForView(
    "Countdown",
    200,
    { cards },
    { season, format, seasonYear },
    showOngoing
  );
  return sortedByCountdown.reduce(
    (acc, card) => {
      const cardDate =
        card.nextAiringEpisode?.airingAt &&
        dayjs(card.nextAiringEpisode?.airingAt * 1000);

      if (cardDate) {
        acc[cardDate.day()] = {
          entries: {
            ...acc[cardDate.day()].entries,
            [cardDate.format("ddd MMM DD")]: {
              ...acc[cardDate.day()].entries[cardDate.format("ddd MMM DD")],
              shows: {
                ...(acc[cardDate.day()].entries?.[cardDate.format("ddd MMM DD")]
                  ?.shows || {}),
                [cardDate.format("h:mm a")]: [
                  ...(acc[cardDate.day()].entries?.[
                    cardDate.format("ddd MMM DD")
                  ]?.shows[cardDate.format("h:mm a")] || []),
                  card,
                ],
              },
            },
          },
          day: cardDate.get("day"),
        };
      }
      return acc;
    },

    [
      { entries: {}, day: 0 },
      { entries: {}, day: 1 },
      { entries: {}, day: 2 },
      { entries: {}, day: 3 },
      { entries: {}, day: 4 },
      { entries: {}, day: 5 },
      { entries: {}, day: 6 },
    ] as {
      entries: {
        [day in string]: { shows: { [t in string]: MainCard[] } };
      };
      day: number;
    }[]
  );
};
export default OngoingToGroupedByDay;
