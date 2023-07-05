import dayjs from "dayjs";
import { isAiringSchedule } from "../Cards/CheckCardType";
import HandleAPICall from "./HandleAPICall";
import { calendarAiringTodayQuery } from "./QueryStrings/CalendarAiringToday";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { Dispatch, SetStateAction } from "react";

async function requestCalendarCards(
  slotFramework: {
    entries: {
      date: string;
      slots: {
        [x: string]: MainCard[];
      }[];
    }[];
    day: number;
  }[],
  setSlotFramework: Dispatch<SetStateAction<typeof slotFramework>>,
  signal: AbortSignal
) {
  const variables = {
    page: 0,
    perPage: 50,
    airingAt_greater: Math.floor(Date.now() / 1000) - 86400,
    airingAt_lesser: Math.floor(Date.now() / 1000),
  };
  await HandleAPICall(variables, [], calendarAiringTodayQuery, signal)
    .then((airingSchedule) => {
      if (isAiringSchedule(airingSchedule)) {
        return airingSchedule.filter(({ media }) => media.format === "TV");
      }
    })
    .then((airingSchedule) => {
      if (!airingSchedule) return;
      const copy = [...slotFramework];

      const newEntries = airingSchedule.reduce(
        (acc, { airingAt, media, episode }, i) => {
          media.nextAiringEpisode = {
            airingAt,
            episode,
            timeUntilAiring: media.nextAiringEpisode?.timeUntilAiring || 0,
          };
          const date = dayjs(airingAt * 1000);
          const strDate = date.format("ddd MMM DD YYYY");
          const strTime = date.format("h:mm a");

          const timeSlot = acc[i]?.slots?.find((slot) => strTime in slot) || {
            [strTime]: [],
          };
          const timeSlotIndex = acc[i]?.slots?.findIndex(
            (slot) => strTime in slot
          );

          return (acc = [
            ...acc,
            {
              date: strDate,
              dayInd: date.day(),
              slots: [
                ...(acc[i]?.slots || []),
                {
                  ...timeSlot,
                  [strTime]: [
                    ...(acc[i]?.slots?.[timeSlotIndex]?.[strTime] || []),
                    media,
                  ],
                },
              ],
            },
          ]);
        },
        [] as {
          date: string;
          dayInd: number;
          slots: { [time in string]: MainCard[] }[];
        }[]
      );

      newEntries.forEach(({ date, dayInd, slots }) => {
        copy[dayInd].entries = [
          { date: date.slice(0, -5), slots },
          ...copy[dayInd].entries,
        ];
      });

      return setSlotFramework(copy);
    })
    .catch(console.log);
}

export default requestCalendarCards;
