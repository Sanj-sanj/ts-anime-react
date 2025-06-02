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
    airingAt_greater: dayjs().startOf('day').unix() / 1000,
    airingAt_lesser: dayjs().add(-1, 'day').startOf('day').unix()
  };
  await HandleAPICall(variables, [], calendarAiringTodayQuery, signal)
    .then((airingSchedule) => {
      if (isAiringSchedule(airingSchedule)) {
        return airingSchedule.filter(
          ({ media }) => media.format === "TV" || media.format === "TV_SHORT"
        );
      }
    })
    .then((airingSchedule) => {
      if (!airingSchedule) return;
      const slotFrameCopy = [...slotFramework];

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

          const timeSlot = acc[i]?.slots?.find((slot) => strTime in slot) || {
            [strTime]: [],
          };
          const timeSlotIndex = acc[i]?.slots?.findIndex(
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
            const reusableSlot = hasEntryByDate.slots.find((slot) => 
                strTime in slot
            )
            if (reusableSlot) {
                reusableSlot[strTime].push(media)
            } else {
                acc[entryIndex].slots = [
                    ...hasEntryByDate.slots,
                    {
                        [strTime]: [
                            ...(hasEntryByDate.slots.find(
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

      showsAiredPriorToToday.forEach(({ date, dayInd, slots }) => {
        const previousEntryInd = slotFrameCopy[dayInd].entries.findIndex(
          (entry) => date.slice(0, -5) === entry.date
        );
        if (previousEntryInd >= 0) {
          // if a show aired while there are unaired shows in the same date range,
          // appends previous entries to the current entry container
          slotFrameCopy[dayInd].entries[previousEntryInd].slots = [
            ...slots,
            ...(slotFrameCopy[dayInd].entries[previousEntryInd]?.slots || []),
          ];
          return;
        }
        slotFrameCopy[dayInd].entries = [
          {
            date: date.slice(0, -5),
            slots,
          },
          ...slotFrameCopy[dayInd].entries,
        ];
      });

      return setSlotFramework(slotFrameCopy);
    })
    .catch(console.log);
}

export default requestCalendarCards;
