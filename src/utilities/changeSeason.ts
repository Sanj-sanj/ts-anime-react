import { APIVariables, Season } from "../interfaces/apiResponseTypes";
import { Actions, ClientVariables } from "../interfaces/initialConfigTypes";

export default function changeSeason(
        change: "up" | "down", 
        dispatch: React.Dispatch<Actions>,
        client : ClientVariables,
        variables: APIVariables
    ) {
    const seasons: Season[] = ["WINTER", "SPRING", "SUMMER", "FALL"];
    let currIndex = seasons.findIndex((v) => v === client.season);
    let updatedYear = client.seasonYear;
    if (change === "up") {
      currIndex++;
    } else {
      currIndex--;
    }
    if (currIndex === 4) {
      currIndex = 0;
      updatedYear++;
    } else if (currIndex === -1) {
      currIndex = 3;
      updatedYear--;
    }
    dispatch({
      type: "UPDATE_CLIENT",
      payload: {
        ...client,
        season: seasons[currIndex],
        seasonYear: updatedYear,
      },
    });
    dispatch({
      type: "UPDATE_VARIABLES",
      payload: {
        ...variables,
        season: seasons[currIndex],
        seasonYear: updatedYear,
      },
    });
  }

