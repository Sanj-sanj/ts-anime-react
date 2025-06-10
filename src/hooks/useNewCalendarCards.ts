import { useEffect, useRef, useState } from "react";
import requestCalendarCards from "../utilities/API/requestCalendarCards";
import { CalendarTimeSlots } from "../interfaces/CalendarTypes";
import { Formats } from "../interfaces/apiResponseTypes";
import { ValidFormats } from "../interfaces/initialConfigTypes";

export default function useNewCalendarCards(initialSlots: CalendarTimeSlots, {format, format_in}: {format: ValidFormats, format_in: Formats}) {
  const abortCalendar = useRef<null | AbortController>(null);
  const [slotFramework, setSlotFramework] = useState(initialSlots);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // isMockOn needs to be set to FALSE for the entire component to behave
    // as expected... our mock is not constantly up to date therefor the 
    // onGoing results end up out of date and we get multiple list items 
    // in the timeline component causing straight up mystery bugs...
   
    abortCalendar.current = new AbortController();
    // requests anilist api for shows released in the last 24 hours
    // groups and sets them into state
    void requestCalendarCards(
      initialSlots,
      setSlotFramework,
      abortCalendar.current.signal,
      setIsLoading,
      format_in
    );
    return () => abortCalendar.current?.abort();
  }, [format]);

    return {isLoading, slotFramework}
}
