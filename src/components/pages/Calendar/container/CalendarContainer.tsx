import dayjs from "dayjs";
import UserListPreferences from "../../UserList/preferenceBar/UserListPreference";
import { useStateContext } from "../../../../utilities/Context/AppContext";
import {
  MainCard,
  NextAiringEpisode,
  ShowStatus,
} from "../../../../interfaces/apiResponseTypes";
import { sortAndFilterCardsForView } from "../../../../utilities/Cards/CardContainerUtils";
import setCountdownText from "../../../../utilities/Cards/setCountdownText";
import { useState } from "react";

const CalendarContainer = () => {
  // make a function to generate a array of 7 calendar dates for timetable view:
  // view will have yesterday first, then todaym then rest of the 5 days
  // {date/title: "Fri Jun 20", schedule: 'am': [{show 1 stuff, timeslot: '12:00', {show 2, timeslot: '4:45'...}], 'pm': [ {etc... }] }

  const {
    cards,
    client: { season, seasonYear, showOngoing, titlesLang },
    variables: { format },
  } = useStateContext();

  const ongoingToGroupedByDay = () => {
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
                // date: cardDate,
                shows: [
                  ...(acc[cardDate.day()].entries?.[
                    cardDate.format("ddd MMM DD")
                  ]?.shows || []),
                  card,
                ],
              },
            },
            // shows: [...acc[cardDate.day()].shows, card],
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
          [day in string]: { shows: MainCard[] };
        };
        day: number;
      }[]
    );
  };
  const somethjan = (
    nextAiringEpisode: NextAiringEpisode,
    status: ShowStatus
  ) => {
    type FAULTY = "FINISHED" | "CANCELED" | "HIATUS";
    const faultyStatus: FAULTY[] = ["FINISHED", "CANCELED", "HIATUS"];
    const found = faultyStatus.find((e) => e === status);
    if (found) {
      return found;
    }
    const now = dayjs();
    const then2 = dayjs(
      nextAiringEpisode?.airingAt && nextAiringEpisode.airingAt * 1000
    );
    const days = then2.diff(now, "d"),
      hours = then2.diff(now, "h") % 24,
      mins = then2.diff(now, "m") % 60,
      secs = then2.diff(now, "s") % 60;
    return `Ep: ${nextAiringEpisode?.episode || "?"} - ${days}d ${hours}h ${
      mins <= 9 ? "0".concat(mins.toString()) : mins
    }m ${secs <= 9 ? "0".concat(secs.toString()) : secs}s`;
  };

  const slotFramework = ongoingToGroupedByDay();
  console.log(slotFramework);
  const calendarByTimeline = (slots: typeof slotFramework) => {
    return (
      <div className="w-full bg-slate-800 flex justify-between">
        {slots.map(({ day, entries }, i) => {
          return (
            <div
              key={`${day + i}`}
              className="text-center w-full border-x border-t border-slate-500"
            >
              {Object.entries(entries).map(([str, { shows }], i) => {
                if (i !== 0) return <></>;
                return (
                  <>
                    <h2
                      key={str}
                      className={`text-3xl text-blue-400 ${
                        dayjs().format("ddd MMM DD") === str
                          ? "bg-teal-600 text-pink-50"
                          : ""
                      }`}
                    >
                      {str}
                    </h2>
                    {shows.map(
                      ({
                        title,
                        id,
                        coverImage,
                        status,
                        nextAiringEpisode,
                      }) => (
                        <div key={id} className="bg-slate-300 w-full">
                          <div className="w-full flex">
                            <div className="w-2 bg-gray-400 flex items-center"></div>
                            <div className="w-full">
                              <div className="">
                                {dayjs(
                                  (nextAiringEpisode?.airingAt as number) * 1000
                                ).format("h:mm a")}
                              </div>
                              <div className="flex">
                                <img
                                  src={coverImage.medium || ""}
                                  alt=""
                                  className="w-12 h-[72px]"
                                />
                                <h3
                                  className="text-center w-full text-ellipsis line-clamp-3 overflow-hidden"
                                  title={
                                    title[titlesLang] ||
                                    title.romaji ||
                                    title.english ||
                                    ""
                                  }
                                >
                                  {title[titlesLang] ||
                                    title.romaji ||
                                    title.english ||
                                    ""}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <>
      <UserListPreferences />
      <div className="w-full flex flex-col items-center overflow-y-auto h-[90vh]">
        {calendarByTimeline(slotFramework)}
      </div>
    </>
  );
};
export default CalendarContainer;
