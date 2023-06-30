import UserListPreferences from "../../UserList/preferenceBar/UserListPreference";
import { useStateContext } from "../../../../utilities/Context/AppContext";
import { useEffect, useRef, useState } from "react";
// import requestCalendarCards from "../../../../utilities/API/requestCalendarCards";
import OngoingToGroupedByDay from "../OngoingGroupedByDay";
import CalendarByTimeline from "../Timeline";

const CalendarContainer = () => {
  const {
    cards,
    client: { season, seasonYear, titlesLang },
    variables: { format },
  } = useStateContext();

  const abortCalendar = useRef<null | AbortController>(null);
  const [slotFramework, setSlotFramework] = useState(
    OngoingToGroupedByDay({ cards }, { season, seasonYear, format })
  );

  useEffect(() => {
    abortCalendar.current = new AbortController();
    // requests anilist api for shows released in the last 24 hours
    // groups and sets them into state
    // void requestCalendarCards(
    //   slotFramework,
    //   setSlotFramework,
    //   abortCalendar.current.signal
    // );
    return () => abortCalendar.current?.abort();
  }, []);
  console.log(slotFramework);

  return (
    <>
      <UserListPreferences />
      <div className="w-full flex flex-col items-center overflow-y-auto h-[90vh]">
        {CalendarByTimeline(slotFramework, titlesLang)}
      </div>
    </>
  );
};
export default CalendarContainer;
