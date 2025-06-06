import CalendarPreferenceBar from "../preferenceBar/CalendarPreferenceBar";
import { useStateContext } from "../../../../utilities/Context/AppContext";
import { useEffect, useRef, useState } from "react";
import requestCalendarCards from "../../../../utilities/API/requestCalendarCards";
import OngoingToGroupedByDay from "../OngoingGroupedByDay";
import CalendarByTimeline from "../Timeline";

// TO-DO ----- to-do --!to_do 
// this function requires the '/' page to load and call its network request
// then it will properly display the cards of the desired FORMAT.
// if the user hits a different format the Calendar component has to first
// check if any prexisting cards exist, which not only do not exist the data
// we are refrencing to look within also does not exist therefore it crashes.
// we need to call the main network request API request here. 
//
// therefore the main api call in cardContainer needs to be abstracted into
// a set of API calls encapsulated into a provider funct that handles all api
// calls so we do not crash our view pages.

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
    // isMockOn needs to be set to on for the entire component to behave
    // as expected... our mock is not constantly up to date therefor the 
    // onGoing results end up out of date and we get multiple list items 
    // in the timeline component causing straight up mystery bugs...
    
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
  }, [format]);

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
