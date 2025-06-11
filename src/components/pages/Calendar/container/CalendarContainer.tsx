import CalendarPreferenceBar from "../preferenceBar/CalendarPreferenceBar";
import CalendarByTimeline from "../Timeline";
import BuildAndFillTimeslots from "../BuildAndFillTimeslots";
import { CalendarTimeSlots } from "../../../../interfaces/CalendarTypes";
import { useDispatchContext, useStateContext } from "../../../../utilities/Context/AppContext";
import useNewCalendarCards from "../../../../hooks/useNewCalendarCards";
import useNewCards from "../../../../hooks/useNewCards";
import { checkIfCardsExist } from "../../../../utilities/Cards/CardContainerUtils";
import mergePreviousAndCurrentTimeslots from "../mergePreviousAndCurrentTimeslots";
import buildInitialTimeSlots from "../../../../utilities/Calendar/BuildInitialTimeSlots";

const CalendarContainer = () => {
  const dispatch = useDispatchContext()
  const { isCallingAPI } = useNewCards(dispatch)
  const {
    cards,
    client: { season, seasonYear, titlesLang, showOngoing },
    variables: { format }
  } = useStateContext();
  const { isCallingCardsAPI } = useNewCalendarCards(format, dispatch, cards.CALENDAR)

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
    finalizedSlots = BuildAndFillTimeslots({ cards }, { season, seasonYear, format })
    mergePreviousAndCurrentTimeslots(cardsFromContextOrAPI, finalizedSlots)
  }
 
  return (
    <>
      <CalendarPreferenceBar />
      <div className="w-full flex flex-col items-center overflow-y-auto h-[85vh]">
         {isCallingCardsAPI.current || isCallingAPI.current ? 
           <div>loading...</div> : 
           finalizedSlots.length ? 
           <CalendarByTimeline calendarSlots={finalizedSlots} titlesLang={titlesLang} /> : 
           <div>no results</div>
         }
      </div>
    </>
  );
};
export default CalendarContainer;
