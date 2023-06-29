import dayjs from "dayjs";
import { isAiringSchedule } from "../Cards/CheckCardType";
import HandleAPICall from "./HandleAPICall";
import { calendarAiringTodayQuery } from "./QueryStrings/CalendarAiringToday";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { Dispatch, SetStateAction } from "react";

async function requestCalendarCards(
  slotFramework: {
    entries: {
      [x: string]: {
        shows: {
          [x: string]: MainCard[];
        };
      };
    };
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

      const newTemp = airingSchedule.reduce(
        (acc, { airingAt, media, episode }) => {
          if (media.nextAiringEpisode === null) {
            media.nextAiringEpisode = {
              airingAt,
              episode,
              timeUntilAiring: 0,
            };
          }
          const date = dayjs(airingAt * 1000);
          const strDate = date.format("ddd MMM DD");

          acc = {
            ...acc,
            [strDate]: {
              shows: {
                ...(acc?.[strDate]?.shows || {}),
                [date.format("h:mm a")]: [
                  media,
                  ...(acc?.[strDate]?.shows?.[date.format("h:mm a")] || []),
                ],
              },
              day: date.day(),
            },
          };
          return acc;
        },
        {} as {
          [x in string]: {
            shows: { [y in string]: MainCard[] };
            day: number;
          };
        }
      );

      Object.entries(newTemp).forEach(([dateString, { shows, day }]) => {
        copy[day].entries = {
          [dateString]: { ...copy[day].entries[dateString], shows },
          ...copy[day].entries,
        };
      });

      return setSlotFramework(copy);
    })
    .catch(console.log);
}

export default requestCalendarCards;
