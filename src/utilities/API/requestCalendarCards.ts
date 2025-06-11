import dayjs from "dayjs";
import { isAiringSchedule } from "../Cards/CheckCardType";
import HandleAPICall from "./HandleAPICall";
import { calendarAiringTodayQuery } from "./QueryStrings/CalendarAiringToday";
import { Actions } from "../../interfaces/initialConfigTypes";

async function requestCalendarCards(
  dispatch: React.Dispatch<Actions>,
  signal: AbortSignal,
  isCallingCardsAPI: React.MutableRefObject<boolean>,
) {
    console.log('req', isCallingCardsAPI)
  const variables = {
    page: 0,
    perPage: 50,
    airingAt_greater: Math.floor(dayjs().add(-dayjs().day(), 'day').startOf('day').unix()),
    airingAt_lesser: Math.floor(dayjs().unix())
  }
  isCallingCardsAPI.current = true;
  console.log('calling anilist API for previously aired')
 
  await HandleAPICall(variables, [], calendarAiringTodayQuery, signal)
    .then((airingSchedule) => {
      if (!airingSchedule) return;
      if (isAiringSchedule(airingSchedule)) 
        dispatch({type: "UPDATE_CALENDAR", payload: {calendar: airingSchedule, last_called: dayjs()}} )
      return airingSchedule
    })
    .catch(console.log);
  isCallingCardsAPI.current = false;
}

export default requestCalendarCards;
