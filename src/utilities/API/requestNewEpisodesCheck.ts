import { Dispatch } from "react";
import { NewEpisodeCards } from "../../interfaces/apiResponseTypes";
import { Actions } from "../../interfaces/initialConfigTypes";
import { UserPreferences } from "../../interfaces/UserPreferences";
import { isNewEpisodeCards } from "../Cards/CheckCardType";
import HandleAPICall from "./HandleAPICall";
import { newEpisodesCheckQuery } from "./QueryStrings/NewEpisodesQuery";

export default async function requestNewEpisodesCheck(
  ids: number[],
  { WATCHING }: UserPreferences,
  dispatch: Dispatch<Actions>,
  signal?: AbortSignal
) {
  console.log("callingANILIST_API: checking new releases"); //eslint-disable-line
  await HandleAPICall(
    { id_in: ids, page: 1, perPage: 50 },
    [],
    newEpisodesCheckQuery,
    signal
  ).then((val) => {
    if (!isNewEpisodeCards(val)) return;
    // WIll only check if inside of WATCHING , if there is an episode greater than the user's current progress on a specific show
    const hasNewEpisodes = Object.values(WATCHING).reduce((acc, userList) => {
      //Found represents a 'Found' entry inside of the newtwork request, matching the userList object.
      const found = val.find((check) => check.id === userList.id);

      if (
        found &&
        (userList.showAiringStatus === "RELEASING" ||
          userList.showAiringStatus === "NOT_YET_RELEASED")
      ) {
        if (
          (userList.currentEpisode &&
            found.nextAiringEpisode &&
            userList.currentEpisode < found.nextAiringEpisode?.episode - 1) ||
          (userList.currentEpisode &&
            found.episodes &&
            userList.currentEpisode < found.episodes &&
            found.status === "FINISHED")
        )
          acc = [...acc, found];
      }
      if (
        found &&
        (userList.showAiringStatus === "RELEASING" ||
          userList.showAiringStatus === "NOT_YET_RELEASED") &&
        found.status === "FINISHED"
      ) {
        /**
         * this conditional will need to update user's list entries: ENTRY.SHOWAIRINGSTATUS from the above to FINISHED to
         * to prevent paging the API the next time around the user comes to the site.
         */
        console.log("found;", found);
        console.log("user", userList);
        setTimeout(
          () =>
            dispatch({
              type: "UPDATE_PREFERENCE",
              payload: {
                status: "WATCHING",
                cardData: { ...userList, showAiringStatus: "FINISHED" },
              },
            }),
          1000
        );
      }
      return acc;
    }, [] as NewEpisodeCards[]);
    if (hasNewEpisodes.length) {
      dispatch({
        type: "TOGGLE_MODAL",
        payload: {
          action: "OPEN",
          entryPoint: "new release",
          data: hasNewEpisodes,
        },
      });
    }
  });
}
