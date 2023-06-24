import dayjs from "dayjs";
import UserListPreferences from "../../UserList/preferenceBar/UserListPreference";
import { useStateContext } from "../../../../utilities/Context/AppContext";
import { MainCard } from "../../../../interfaces/apiResponseTypes";

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
    let temp: MainCard[];
    if (showOngoing) {
      temp = cards.ONGOING[format].concat(
        cards[season]?.[seasonYear]?.[format]
      );
    } else {
      temp = cards[season]?.[seasonYear]?.[format];
    }
    return temp.reduce(
      (acc, card) => {
        const hasDate =
          card.nextAiringEpisode?.airingAt &&
          dayjs(card.nextAiringEpisode?.airingAt * 1000);
        if (hasDate)
          return { ...acc, [hasDate.day()]: [...acc[hasDate.day()], card] };
        return acc;
      },
      { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] } as {
        [n in number]: MainCard[];
      }
    );
  };

  function genCalendarSlots() {
    const showsGroupedByDay = ongoingToGroupedByDay();
    return new Array(7).fill({}).map((_, i) => {
      const date = dayjs().set("date", dayjs().get("date") + i);

      return {
        day: date.get("day"),
        shows: showsGroupedByDay[date.get("day")],
        date: date,
      };
    });
  }
  const slotFramework = genCalendarSlots();
  const calendarByTimeline = (slots: typeof slotFramework) => {
    console.log("i called");
    return (
      <div className="w-full bg-slate-800 flex justify-between">
        {slots.map(({ day, shows, date }) => {
          return (
            <div
              key={day}
              className="text-center w-full border-x border-t border-slate-500"
            >
              <h2 className="text-3xl text-blue-400 ">
                {date.format("ddd MMM MM")}
              </h2>
              {shows.map(({ title, id, coverImage }) => (
                <div key={id} className="bg-slate-300 w-full">
                  <div></div>
                  <div className="w-full flex">
                    <div className="w-2 bg-gray-400 flex items-center"></div>
                    <div className="w-full flex">
                      <img
                        src={coverImage.medium || ""}
                        alt=""
                        className="w-12 h-[72px]"
                      />
                      <h3>{title[titlesLang] || title.romaji}</h3>
                    </div>
                  </div>
                </div>
              ))}
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
