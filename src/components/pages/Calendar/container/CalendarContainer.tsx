import dayjs from "dayjs";
import UserListPreferences from "../../UserList/preferenceBar/UserListPreference";
import { useStateContext } from "../../../../utilities/Context/AppContext";
import { MainCard } from "../../../../interfaces/apiResponseTypes";
import { sortAndFilterCardsForView } from "../../../../utilities/Cards/CardContainerUtils";

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

  const slotFramework = ongoingToGroupedByDay();

  const calendarByTimeline = (slots: typeof slotFramework) => {
    return (
      <div className="w-full bg-slate-800 flex justify-between">
        {slots.map(({ day, entries }) => {
          return (
            <div
              key={day}
              className="text-center w-full border-x border-t border-slate-500"
            >
              {Object.entries(entries).map(([str, { shows }]) => {
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

                    {shows.map(({ title, id, coverImage }) => (
                      <div key={id} className="bg-slate-300 w-full">
                        <div className="w-full flex">
                          <div className="w-2 bg-gray-400 flex items-center"></div>
                          <div className="w-full flex">
                            <img
                              src={coverImage.medium || ""}
                              alt=""
                              className="w-12 h-[72px]"
                            />
                            <h3 className="text-center w-full text-ellipsis line-clamp-3 overflow-hidden">
                              {title[titlesLang] || title.romaji}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
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
