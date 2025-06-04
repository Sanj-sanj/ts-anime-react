import dayjs from "dayjs";
import { isAiringSchedule } from "../Cards/CheckCardType";
import HandleAPICall from "./HandleAPICall";
import { calendarAiringTodayQuery } from "./QueryStrings/CalendarAiringToday";
import { Formats, MainCard } from "../../interfaces/apiResponseTypes";
import { Dispatch, SetStateAction } from "react";

async function requestCalendarCards(
  slotFramework: {
    entries: {
      date: string;
      shows: {
        [x: string]: MainCard[];
      }[];
    }[];
    day: number;
  }[],
  setSlotFramework: Dispatch<SetStateAction<typeof slotFramework>>,
  signal: AbortSignal,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  format: Formats
) {
  const variables = {
    page: 0,
    perPage: 50,
    airingAt_greater: Math.floor(dayjs().add(-dayjs().day(), 'day').startOf('day').unix()),
    airingAt_lesser: Math.floor(dayjs().startOf('day').unix())
  };
  await HandleAPICall(variables, [], calendarAiringTodayQuery, signal)
    .then((airingSchedule) => {
      if (isAiringSchedule(airingSchedule)) {
        return airingSchedule.filter(
                //i hate this solution but the way the type is made implies
                //that arr[0] should === the [0] of the union type Formats
          ({ media }) => format[0] === media.format
        );
      }
    })
    .then((airingSchedule) => {
      if (!airingSchedule) return;
      const timeslotFrameworkCopy = [...slotFramework];

      const showsAiredPriorToToday = airingSchedule.reduce(
        (acc, { airingAt, media, episode }, i) => {
          media.nextAiringEpisode = {
            airingAt,
            episode,
            timeUntilAiring: media.nextAiringEpisode?.timeUntilAiring || 0,
          };
          const date = dayjs(airingAt * 1000);
          const strDate = date.format("ddd MMM DD YYYY");
          const strTime = date.format("h:mm a");

          const timeSlot = acc[i]?.shows?.find((slot) => strTime in slot) || {
            [strTime]: [],
          };
          const dayIndex = acc[i]?.shows?.findIndex(
            (slot) => strTime in slot
          );

          const hasEntryByDate = acc?.find((entry) => entry.date === strDate);
          if (hasEntryByDate) {
            //if current entry has a date that already exists in the accumulator, reuse that entry and append media to slot.
            const entryIndex = acc.findIndex(
              (entry) => entry.dayInd === hasEntryByDate.dayInd
            );
            
            //resuableSlot exist for when multiple shows air at the same time 
            //ex: 9:00 AM 3 shows, they all get pushed into the correct slot
            const reusableSlot = hasEntryByDate.shows.find((slot) => 
                strTime in slot
            )
            if (reusableSlot) {
                reusableSlot[strTime].push(media)
            } else {
                acc[entryIndex].shows = [
                    ...hasEntryByDate.shows,
                    {
                        [strTime]: [
                            ...(hasEntryByDate.shows.find(
                                (timeslot) => strTime in timeslot
                            )?.[strTime] || []),
                            media,
                        ],
                    },
                ];
            }

            return acc;
          }

          return (acc = [
            ...acc,
            {
              date: strDate,
              dayInd: date.day(),
              shows: [
                ...(acc[i]?.shows || []),
                {
                  ...timeSlot,
                  [strTime]: [
                    ...(acc[i]?.shows?.[dayIndex]?.[strTime] || []),
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
          shows: { [time in string]: MainCard[] }[];
        }[]
      );

      showsAiredPriorToToday.forEach(({ date, dayInd, shows }) => {
        const previousEntryInd = timeslotFrameworkCopy[dayInd].entries.findIndex(
          (entry) => date.slice(0, -5) === entry.date
        );
        if (previousEntryInd >= 0) {
          // if a show aired while there are unaired shows in the same date range,
          // appends previous entries to the current entry container
          timeslotFrameworkCopy[dayInd].entries[previousEntryInd].shows = [
            ...shows,
            ...(timeslotFrameworkCopy[dayInd].entries[previousEntryInd]?.shows || []),
          ];
          return;
        }
        timeslotFrameworkCopy[dayInd].entries = [
          {
            date: date.slice(0, -5),
            shows,
          },
          ...timeslotFrameworkCopy[dayInd].entries,
        ];
      });

      setIsLoading(false)
      return setSlotFramework(timeslotFrameworkCopy);
    })
    .catch(console.log);
}

export default requestCalendarCards;
