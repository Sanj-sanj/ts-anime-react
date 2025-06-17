import { Dispatch } from "react";
import { NewEpisodeCards } from "../../interfaces/apiResponseTypes";
import { Actions } from "../../interfaces/initialConfigTypes";
import {
  ListDetails,
  UserPreferences,
} from "../../interfaces/UserPreferencesTypes";
import { isNewEpisodeCards } from "../Cards/CheckCardType";
import HandleAPICall from "./HandleAPICall";
import { newEpisodesCheckQuery } from "./QueryStrings/NewEpisodesQuery";

// HELPER FUNCTIONS BEGIN
function isUserListEpisodeLessThanNextAiringEpisode(
  userList: ListDetails,
  found: NewEpisodeCards
) {
  return (
    typeof userList.currentEpisode === "number" &&
    found.nextAiringEpisode &&
    userList.currentEpisode < found.nextAiringEpisode?.episode - 1
  );
}
function hasShowFinishedAiringRecently(
  userList: ListDetails,
  found: NewEpisodeCards
) {
  return (
    typeof userList.currentEpisode === "number" &&
    found.episodes &&
    userList.currentEpisode < found.episodes &&
    found.status === "FINISHED"
  );
}
// HELPER FUNCTIONS END

export default async function requestNewEpisodesCheck(
  ids: number[],
  { WATCHING, INTERESTED }: UserPreferences,
  dispatch: Dispatch<Actions>,
  signal?: AbortSignal
) {
  console.log("callingANILIST_API: checking new releases"); //eslint-disable-line
  await HandleAPICall(
    { id_in: ids, page: 1, perPage: 50 },
    [],
    newEpisodesCheckQuery,
    signal
  ).then((userListCards) => {
    if (!isNewEpisodeCards(userListCards)) return;
    console.log('newEpQuery', userListCards)
    // WIll only check if inside of WATCHING , if there is an episode greater than the user's current progress on a specific show
    const hasNewEpisodes = Object.values(WATCHING)
      .concat(Object.values(INTERESTED))
      .reduce((acc, userList) => {
        //Found represents a 'Found' entry inside of the newtwork request, matching the userList object.
        const found = userListCards.find((check) => check.id === userList.id);
        if (
          found &&
          (userList.showAiringStatus === "RELEASING" ||
            userList.showAiringStatus === "NOT_YET_RELEASED")
        ) {
          if (
            isUserListEpisodeLessThanNextAiringEpisode(userList, found) ||
            hasShowFinishedAiringRecently(userList, found)
          ) {
            if (hasShowFinishedAiringRecently(userList, found)) {
              dispatch({
                type: "UPDATE_PREFERENCE",
                payload: {
                  status: "WATCHING",
                  cardData: { ...userList, showAiringStatus: "FINISHED" },
                },
              });
            }
            acc = [...acc, found];
          }
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
