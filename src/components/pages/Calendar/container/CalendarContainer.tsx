import CalendarPreferenceBar from "../preferenceBar/CalendarPreferenceBar";
import { useStateContext } from "../../../../utilities/Context/AppContext";
import { useEffect, useRef, useState } from "react";
import requestCalendarCards from "../../../../utilities/API/requestCalendarCards";
import OngoingToGroupedByDay from "../OngoingGroupedByDay";
import CalendarByTimeline from "../Timeline";

const CalendarContainer = () => {
  const {
    cards,
    client: { season, seasonYear, titlesLang },
    variables: { format, format_in}
  } = useStateContext();

  const abortCalendar = useRef<null | AbortController>(null);
  const [slotFramework, setSlotFramework] = useState(
    OngoingToGroupedByDay({ cards }, { season, seasonYear, format })
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    abortCalendar.current = new AbortController();
    // requests anilist api for shows released in the last 24 hours
    // groups and sets them into state
    void requestCalendarCards(
      slotFramework,
      setSlotFramework,
      abortCalendar.current.signal,
      setIsLoading,
      format_in
    );
    return () => abortCalendar.current?.abort();
  }, []);

  return (
    <>
      <CalendarPreferenceBar />
      <div className="w-full flex flex-col items-center overflow-y-auto h-[85vh]">
        {isLoading ? 'loading...' : <CalendarByTimeline airingByWeek={slotFramework} titlesLang={titlesLang} />}
      </div>
    </>
  );
};
export default CalendarContainer;
