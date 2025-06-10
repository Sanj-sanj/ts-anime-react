import { CalendarTimeSlots } from "../../../interfaces/CalendarTypes";

export default function mergePreviousAndCurrentTimeslots(
    previouslyAired: CalendarTimeSlots,
    currentAiring: CalendarTimeSlots
) {
    return currentAiring.forEach((timeSlot, i) => {
        if(previouslyAired[i].entries[0]) {
            timeSlot.entries.unshift(previouslyAired[i].entries[0])
        }
    })
}
