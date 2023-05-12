import { Season } from "../interfaces/apiResponseTypes";

export default function getCurrSeasonAndYear(): [Season, number] {
  //load this function on initial load to get nearest season & year
  const today = new Date();
  const seasons: Season[] = ["WINTER", "SPRING", "SUMMER", "FALL"];
  const thisSeason: Season = seasons[Math.round((today.getMonth() + 1) / 4)];
  const thisYear = today.getFullYear();
  return [thisSeason, thisYear];
}
