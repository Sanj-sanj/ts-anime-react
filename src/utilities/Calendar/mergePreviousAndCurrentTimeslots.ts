import { CalendarTimeSlots } from "../../../interfaces/CalendarTypes";

export default function mergePreviousAndCurrentTimeslots(
    previouslyAired: CalendarTimeSlots,
    currentAiring: CalendarTimeSlots
) {
    currentAiring.forEach((timeSlot, i) => {
        const date = timeSlot?.entries?.[0]?.date;
        if(previouslyAired[i]?.entries?.[0]?.date === date) {
            timeSlot.entries?.[0]?.shows?.unshift(...previouslyAired?.[i]?.entries?.[0]?.shows || [])
            return;
        }
        if(previouslyAired[i].entries[0]) {
            timeSlot.entries.unshift(previouslyAired[i].entries[0])
        }
    }) 
}
