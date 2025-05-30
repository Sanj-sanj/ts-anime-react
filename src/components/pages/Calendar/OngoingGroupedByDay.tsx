import dayjs from "dayjs";
import { MainCard, Season } from "../../../interfaces/apiResponseTypes";
import {
  InitialConfig,
  ValidFormats,
} from "../../../interfaces/initialConfigTypes";
import sortAndFilterCardsForView from "../../../utilities/Cards/SortAndFilterCardsView";

const OngoingToGroupedByDay = (
  { cards }: Pick<InitialConfig, "cards">,
  {
    season,
    format,
    seasonYear,
  }: { season: Season; format: ValidFormats; seasonYear: number }
) => {
  const sortedByCountdown = sortAndFilterCardsForView(
    "Countdown",
    200,
    { cards },
    { season, format, seasonYear },
    true
  );
  return sortedByCountdown.reduce(
    (acc, card) => {
      const cardDate =
        card.nextAiringEpisode?.airingAt &&
        dayjs(card.nextAiringEpisode?.airingAt * 1000);

      if (cardDate) {
        const dateString = cardDate.format("ddd MMM DD");
        const timeString = cardDate.format("h:mm a");
        const slotIndexByDay = acc[cardDate.day()].entries.findIndex(
          ({ date: dateKey }) => dateKey === dateString
        );
        let slotIndexByTime = -1;

        if (slotIndexByDay >= 0) {
          slotIndexByTime = acc[cardDate.day()].entries[
            slotIndexByDay
          ].slots.findIndex((slot) => timeString in slot);

          if (slotIndexByTime >= 0) {
            acc[cardDate.day()].entries[slotIndexByDay].slots[slotIndexByTime][
              timeString
            ] = [
              ...acc[cardDate.day()].entries[slotIndexByDay].slots[
                slotIndexByTime
              ][timeString],
              card,
            ];
            return acc;
          }

          acc[cardDate.day()].entries[slotIndexByDay].slots = [
            ...acc[cardDate.day()].entries[slotIndexByDay].slots,
            { [timeString]: [card] },
          ];
          return acc;
        }

        acc[cardDate.day()] = {
          entries: [
            ...acc[cardDate.day()].entries,
            {
              date: dateString,
              slots: [
                {
                  [timeString]: [card],
                },
              ],
            },
          ],
          day: cardDate.get("day"),
        };
      }
      return acc;
    },

    [
      { entries: [], day: 0 },
      { entries: [], day: 1 },
      { entries: [], day: 2 },
      { entries: [], day: 3 },
      { entries: [], day: 4 },
      { entries: [], day: 5 },
      { entries: [], day: 6 },
    ] as {
      entries: { date: string; slots: { [time in string]: MainCard[] }[] }[];
      day: number;
    }[]
  );
};
export default OngoingToGroupedByDay;
