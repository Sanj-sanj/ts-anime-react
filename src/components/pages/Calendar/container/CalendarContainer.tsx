import dayjs from "dayjs";
import UserListPreferences from "../../UserList/preferenceBar/UserListPreference";
import { useStateContext } from "../../../../utilities/Context/AppContext";
import { MainCard } from "../../../../interfaces/apiResponseTypes";
import { sortAndFilterCardsForView } from "../../../../utilities/Cards/CardContainerUtils";
import { useEffect, useState } from "react";
import { airingTodayQuery } from "../../../../utilities/API/QueryStrings/CalendarAiringToday";

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
                shows: {
                  ...(acc[cardDate.day()].entries?.[
                    cardDate.format("ddd MMM DD")
                  ]?.shows || {}),
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
  const [slotFramework, setSlotFramework] = useState(ongoingToGroupedByDay());

  useEffect(() => {
    // Define our query variables and values that will be used in the query request
    // Define the config we'll need for our Api request
    const url = "https://graphql.anilist.co",
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: airingTodayQuery,
          variables: {
            page: 0,
            perPage: 50,
            airingAt_greater: Math.floor(Date.now() / 1000) - 86400,
            airingAt_lesser: Math.floor(Date.now() / 1000),
          },
        }),
      };

    interface something {
      data: {
        Page: {
          pageInfo: {
            currentPage: number;
            hasNextPage: boolean;
            lastPage: number;
            perPage: number;
            total: number;
          };
          airingSchedules: {
            airingAt: number;
            id: number;
            media: MainCard;
            episode: number;
          }[];
        };
      };
    }
    // Make the HTTP Api request
    fetch(url, options)
      .then((res) => res.json() as Promise<something>)
      .then((v) => {
        return v.data.Page.airingSchedules.filter(
          ({ media }) => media.format === "TV"
        );
      })
      .then((v) => {
        v.forEach(({ airingAt, media, episode }) => {
          if (media.nextAiringEpisode === null) {
            media.nextAiringEpisode = { airingAt, episode, timeUntilAiring: 0 };
          }

          const date = dayjs(airingAt * 1000);
          const strDate = date.format("ddd MMM DD");
          const copy = [...slotFramework];
          console.log(copy);
          const temp = {
            [strDate]: {
              shows: {
                ...(copy[date.day()].entries[strDate]?.shows || {}),
                [date.format("h:mm a")]: [
                  media,
                  ...(copy[date.day()].entries?.[strDate]?.shows?.[
                    date.format("h:mm a")
                  ] || []),
                ],
              },
            },
          };
          console.log(temp);

          copy[date.day()].entries = {
            ...temp,
            ...copy[date.day()].entries,
          };
          console.log(copy);
          setSlotFramework(copy);
        });
      })
      .catch(console.log); //eslint-disable-line
  }, []);

  console.log("1", slotFramework);
  const calendarByTimeline = (slots: typeof slotFramework) => {
    return (
      <div className="w-full bg-slate-800 flex justify-between">
        {slots.map(({ day, entries }) => {
          return (
            <div
              key={day}
              className="text-center w-full border-x border-t border-slate-500"
            >
              {Object.entries(entries).map(([str, { shows }], i) => {
                if (i > 0) return <></>;
                return (
                  <div key={`${str}-${i}`}>
                    <h2
                      className={`text-3xl text-blue-400 ${
                        dayjs().format("ddd MMM DD") === str
                          ? "bg-teal-600 text-pink-50"
                          : ""
                      }`}
                    >
                      {str}
                    </h2>
                    <div className="flex w-full">
                      <div className="w-2 min-w-[0.5rem] max-w-[0.5rem] bg-gray-400 flex items-center"></div>
                      <div className="bg-slate-300 py-6 w-full">
                        {Object.entries(shows).map(([hour, shows]) => {
                          return (
                            <div key={`${day}-${hour}`} className="w-full">
                              <div className="w-full flex">
                                <div className="w-full">
                                  <div className="">{hour}</div>
                                  {shows.map(
                                    ({
                                      id,
                                      coverImage,
                                      title,
                                      episodes,
                                      status,
                                      nextAiringEpisode,
                                    }) => (
                                      <div key={id} className="flex w-full">
                                        <img
                                          src={coverImage.medium || ""}
                                          alt=""
                                          className="w-12 h-[72px]"
                                        />
                                        <div className="w-full">
                                          <h3
                                            className="text-left w-full  text-ellipsis line-clamp-2 overflow-hidden"
                                            style={{ wordBreak: "break-word" }}
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
                                          <p className="text-right text-sm font-bold mr-2 text-teal-900">
                                            Ep:{" "}
                                            {status === "FINISHED"
                                              ? episodes
                                              : `${
                                                  nextAiringEpisode?.episode ||
                                                  "???"
                                                }`}
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
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
