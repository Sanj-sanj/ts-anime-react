import dayjs from "dayjs";
import { CalendarTimeSlots } from "../../interfaces/CalendarTypes";
import { AiringSchedule, Format_In, MainCard } from "../../interfaces/apiResponseTypes";
import { ValidFormats } from "../../interfaces/initialConfigTypes";

export default function buildInitialTimeSlots(
    airingSchedule: AiringSchedule[],
    slotFramework: CalendarTimeSlots,
    format: ValidFormats
) {
    //take the initial API call or the stuff saved in context 
    const timeslotFrameworkCopy = [...slotFramework] as CalendarTimeSlots;
    const formats: { [k in ValidFormats]: Format_In } = {
      TV: ["TV", "TV_SHORT"],
      MOVIE: ["MOVIE", "SPECIAL"],
      OVA: ["ONA", "OVA"],
    };


    function filterScheduleByFormat () {
        return airingSchedule.filter( ({ media }) => {
          return formats[format].some((v) => v === media.format)
        });
    }

    const showsAiredPriorToToday = filterScheduleByFormat().reduce(
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

    return timeslotFrameworkCopy
}
