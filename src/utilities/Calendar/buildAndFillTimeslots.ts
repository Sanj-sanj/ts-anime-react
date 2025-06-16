import dayjs from "dayjs";
import { InitialConfig, ValidFormats } from "../../interfaces/initialConfigTypes";
import { Season } from "../../interfaces/apiResponseTypes";
import sortAndFilterCardsForView from "../Cards/SortAndFilterCardsView";
import { CalendarTimeSlots } from "../../interfaces/CalendarTypes";

export default function buildAndFillTimeslots(
  { cards }: Pick<InitialConfig, "cards">,
  {
    season,
    format,
    seasonYear,
  }: { season: Season; format: ValidFormats; seasonYear: number }
) {
  const sortedByCountdown = sortAndFilterCardsForView(
    "Countdown",
    200,
    { cards },
    { season, format, seasonYear },
    true
  );

  return sortedByCountdown.reduce((acc, show) => {
      const cardDate = show.nextAiringEpisode?.airingAt &&
        dayjs(show.nextAiringEpisode?.airingAt * 1000);

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
          ].shows.findIndex((slot) => timeString in slot);

          if (slotIndexByTime >= 0) {
            acc[cardDate.day()].entries[slotIndexByDay].shows[slotIndexByTime][
              timeString
            ] = [
              ...acc[cardDate.day()].entries[slotIndexByDay].shows[
                slotIndexByTime
              ][timeString],
              show,
            ];
            return acc;
          }

          acc[cardDate.day()].entries[slotIndexByDay].shows = [
            ...acc[cardDate.day()].entries[slotIndexByDay].shows,
            { [timeString]: [show] },
          ];
          return acc;
        }

        acc[cardDate.day()] = {
          entries: [
            ...acc[cardDate.day()].entries,
            {
              date: dateString,
              shows: [
                {
                  [timeString]: [show],
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
    ] as CalendarTimeSlots
  );
};

