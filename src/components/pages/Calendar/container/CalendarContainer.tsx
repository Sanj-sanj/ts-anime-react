import CalendarPreferenceBar from "../preferenceBar/CalendarPreferenceBar";
import CalendarByTimeline from "../Timeline";
import { CalendarTimeSlots } from "../../../../interfaces/CalendarTypes";
import { useDispatchContext, useStateContext } from "../../../../utilities/Context/AppContext";
import { checkIfCardsExist } from "../../../../utilities/Cards/CardContainerUtils";
import buildInitialTimeSlots from "../../../../utilities/Calendar/buildInitialTimeSlots";
import buildAndFillTimeslots from "../../../../utilities/Calendar/buildAndFillTimeslots";
import mergePreviousAndCurrentTimeslots from "../../../../utilities/Calendar/mergePreviousAndCurrentTimeslots";
import useNewCalendarCards from "../../../../hooks/useNewCalendarCards";
import useFocus from "../../../../hooks/useFocus";
import { resetToNearestSeason } from "../../../../utilities/changeSeason";

const CalendarContainer = () => {
  const dispatch = useDispatchContext()
  const {
    cards,
    client: { season, seasonYear, titlesLang, showOngoing },
    variables: { format },
    variables,
    client
  } = useStateContext();
  resetToNearestSeason(dispatch, client, variables)
  const { isCallingCardsAPI } = useNewCalendarCards(format, dispatch, cards.CALENDAR)
  const {lastFocusedElement} = useFocus(client);

  let finalizedSlots: CalendarTimeSlots = []
  const initialCards: CalendarTimeSlots = [
    { entries: [], day: 0 },
    { entries: [], day: 1 },
    { entries: [], day: 2 },
    { entries: [], day: 3 },
    { entries: [], day: 4 },
    { entries: [], day: 5 },
    { entries: [], day: 6 },
  ]

  if (checkIfCardsExist(season, seasonYear, format, showOngoing, { cards })) {
    //merge the result of previous aired API call with the result of our main API network call
    const cardsFromContextOrAPI = buildInitialTimeSlots(cards.CALENDAR.SHOWS, initialCards, format)
    finalizedSlots = buildAndFillTimeslots({ cards }, { season, seasonYear, format })
    mergePreviousAndCurrentTimeslots(cardsFromContextOrAPI, finalizedSlots)
  }
 
  return (
    <>
      <CalendarPreferenceBar />
      <div className="w-full flex flex-col items-center overflow-y-auto h-[85vh]">
         {isCallingCardsAPI.current ?
           <div>loading...</div> : 
           finalizedSlots.length ? 
           <CalendarByTimeline calendarSlots={finalizedSlots} titlesLang={titlesLang} focusRef={lastFocusedElement} /> : 
           <div>no results</div>
         }
      </div>
    </>
  );
};
export default CalendarContainer;
