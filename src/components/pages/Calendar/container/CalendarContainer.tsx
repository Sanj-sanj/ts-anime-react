import CalendarPreferenceBar from "../preferenceBar/CalendarPreferenceBar";
import CalendarByTimeline from "../Timeline";
import BuildAndFillTimeslots from "../BuildAndFillTimeslots";
import { CalendarTimeSlots } from "../../../../interfaces/CalendarTypes";
import { useDispatchContext, useStateContext } from "../../../../utilities/Context/AppContext";
import useNewCalendarCards from "../../../../hooks/useNewCalendarCards";
import useNewCards from "../../../../hooks/useNewCards";
import { checkIfCardsExist } from "../../../../utilities/Cards/CardContainerUtils";
import mergePreviousAndCurrentTimeslots from "../mergePreviousAndCurrentTimeslots";

const CalendarContainer = () => {
  const dispatch = useDispatchContext()
  const {cardView: { ammount, setAmmount, containerRef }, isCallingAPI, isMoreCards } = useNewCards(dispatch)
  const {
    cards,
    client: { season, seasonYear, titlesLang, showOngoing, sort },
    variables: { format, format_in}
  } = useStateContext();
  const initialCards: CalendarTimeSlots = [
      { entries: [], day: 0 },
      { entries: [], day: 1 },
      { entries: [], day: 2 },
      { entries: [], day: 3 },
      { entries: [], day: 4 },
      { entries: [], day: 5 },
      { entries: [], day: 6 },
    ]
  const { slotFramework, isLoading } = useNewCalendarCards([...initialCards], {format, format_in})
  let temp: CalendarTimeSlots = []

  if (checkIfCardsExist(season, seasonYear, format, showOngoing, { cards })) {
        //merge the result of previous aired API call with the result of our main API network call
    temp  = BuildAndFillTimeslots({ cards }, { season, seasonYear, format })
    mergePreviousAndCurrentTimeslots(slotFramework, temp)
  }
 
  return (
    <>
      <CalendarPreferenceBar />
      <div className="w-full flex flex-col items-center overflow-y-auto h-[85vh]">
         {isLoading.current || isCallingAPI.current ? 
           <div>loading...</div> : 
           temp.length ? 
           <CalendarByTimeline calendarSlots={temp} titlesLang={titlesLang} /> : 
           <div>no results</div>
         }
      </div>
    </>
  );
};
export default CalendarContainer;
