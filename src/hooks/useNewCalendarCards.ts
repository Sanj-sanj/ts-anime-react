import { useEffect, useRef, useState } from "react";
import requestCalendarCards from "../utilities/API/requestCalendarCards";
import { CalendarTimeSlots } from "../interfaces/CalendarTypes";
import { Formats } from "../interfaces/apiResponseTypes";

export default function useNewCalendarCards(initialSlots: CalendarTimeSlots, format: Formats) {
  const abortCalendar = useRef<null | AbortController>(null);
  const [slotFramework, setSlotFramework] = useState(initialSlots);
  const isLoading = useRef(true)
  useEffect(() => {
    // isMockOn needs to be set to FALSE for the entire component to behave
    //todo: cache the results of the network call for the duration user remains in calendar 
    abortCalendar.current = new AbortController();
    // requests anilist api for shows released in the last 24 hours
    // groups and sets them into state
    void requestCalendarCards(
      initialSlots,
      setSlotFramework,
      abortCalendar.current.signal,
      isLoading,
    );
    return () => abortCalendar.current?.abort();
  }, [format]);

    return {isLoading, slotFramework}
}
