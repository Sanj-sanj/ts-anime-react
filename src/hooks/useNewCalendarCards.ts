import { useEffect, useRef } from "react";
import requestCalendarCards from "../utilities/API/requestCalendarCards";
import { Actions, ValidFormats } from "../interfaces/initialConfigTypes";
import dayjs, { Dayjs } from "dayjs";
import { AiringSchedule } from "../interfaces/apiResponseTypes";

export default function useNewCalendarCards(format: ValidFormats, dispatch: React.Dispatch<Actions>, calendar: { SHOWS: AiringSchedule[], LAST_CALLED: Dayjs}) {
  const abortCalendar = useRef<null | AbortController>(null);
  const isCallingCardsAPI = useRef(false)
  useEffect(() => {
    // isMockOn needs to be set to FALSE for the entire component to behave
    abortCalendar.current = new AbortController();
    
    if(
      !calendar.SHOWS.length || 
      calendar.SHOWS.length && dayjs().diff(calendar.LAST_CALLED, 'minutes') >= 5
      ) {
      // requests anilist api for shows released in the last 24 hours
      //saves into context's Cards.Calendar
      void requestCalendarCards(
        dispatch,
        abortCalendar.current.signal,
        isCallingCardsAPI,
      );
    }
    return () => abortCalendar.current?.abort();
  }, [format]);

    return { isCallingCardsAPI }
}
