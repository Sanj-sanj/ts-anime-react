import CalendarPreferenceBar from "../preferenceBar/CalendarPreferenceBar";
import CalendarByTimeline from "../Timeline";
import BuildAndFillTimeslots from "../BuildAndFillTimeslots";
import { CalendarTimeSlots } from "../../../../interfaces/CalendarTypes";
import { useDispatchContext, useStateContext } from "../../../../utilities/Context/AppContext";
import useNewCalendarCards from "../../../../hooks/useNewCalendarCards";
import useNewCards from "../../../../hooks/useNewCards";
import { checkIfCardsExist } from "../../../../utilities/Cards/CardContainerUtils";

const CalendarContainer = () => {
  const dispatch = useDispatchContext()
  const {cardView: { ammount, setAmmount, containerRef }, isCallingAPI, isMoreCards } = useNewCards(dispatch)
  const {
    cards,
    client: { season, seasonYear, titlesLang, showOngoing, sort },
    variables: { format, format_in}
  } = useStateContext();
  let initialCards: CalendarTimeSlots = []

  if (checkIfCardsExist(season, seasonYear, format, showOngoing, { cards })) {
    initialCards = BuildAndFillTimeslots({ cards }, { season, seasonYear, format })
        console.log(initialCards)
  }

  const { slotFramework, isLoading } = useNewCalendarCards(initialCards, {format, format_in})
console.log(slotFramework)
  return (
    <>
      <CalendarPreferenceBar />
      <div className="w-full flex flex-col items-center overflow-y-auto h-[85vh]">
         {isLoading || isCallingAPI.current ? <div>loading...</div>: <CalendarByTimeline airingByWeek={slotFramework} titlesLang={titlesLang} />}
      </div>
    </>
  );
};
export default CalendarContainer;
