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
      console.log(airingSchedule);
      const copy = [...slotFramework];

      const newTemp = airingSchedule.reduce(
        (acc, { airingAt, media, episode }) => {
          media.nextAiringEpisode = {
            airingAt,
            episode,
            timeUntilAiring: media.nextAiringEpisode?.timeUntilAiring || 0,
          };
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
        const temp = {
          [dateString]: { ...(copy[day].entries[dateString] || { shows: {} }) },
          ...copy[day].entries,
          // ...{ shows: {} as { [x in string]: MainCard[] } },
        };
        console.log("1", temp);
        // console.log(copy[day].entries);
        Object.entries(shows).map(([timeString, cards]) => {
          if (!temp[dateString].shows) {
            console.log("hi", dateString);
          }
          temp[dateString].shows[timeString] = [
            ...(temp[dateString].shows?.[timeString] || []),
            ...cards,
          ];
          // console.log(temp);
        });
        console.log(copy[day].entries[dateString].shows);
        // temp[dateString].shows = { ...copy[day].entries[dateString].shows };
      });

      return setSlotFramework(copy);
    })
    .catch(console.log);
}

export default requestCalendarCards;
