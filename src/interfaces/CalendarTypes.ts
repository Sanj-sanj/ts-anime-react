import { MainCard } from "./apiResponseTypes";

export type CalendarTimeSlots = {
    entries: { date: string; shows: { [time in string]: MainCard[] }[] }[];
    day: number;
}[]
