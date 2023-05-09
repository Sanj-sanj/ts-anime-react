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
      const found = val.find((check) => check.id === userList.id);
      if (found) {
        if (
          userList.currentEpisode &&
          found.nextAiringEpisode &&
          userList.currentEpisode < found.nextAiringEpisode?.episode - 1
        )
          return [...acc, found];
        return acc;
      }
      return [];
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
