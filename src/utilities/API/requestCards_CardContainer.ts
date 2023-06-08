import {
  APIVariables,
  MainCard,
  NewEpisodeCards,
} from "../../interfaces/apiResponseTypes";
import { Actions } from "../../interfaces/initialConfigTypes";
import HandleMockAPICall from "./HandleMockAPICall";
import HandleAPICall from "./HandleAPICall";
import { MutableRefObject } from "react";
import { mainCardQuery } from "./QueryStrings/MainCardQuery";
import { isMainCard } from "../Cards/CheckCardType";

//Request from Anilist API
async function requestAniListAPI(
  variables: APIVariables,
  dispatch: React.Dispatch<Actions>,
  isCallingAPI: MutableRefObject<boolean>,
  fetchingOngoing: boolean,
  signal1: AbortSignal,
  signal2: AbortSignal
) {
  console.log("calling ANILIST_API");
  isCallingAPI.current = true;
  const callsArr: Promise<(MainCard | NewEpisodeCards)[]>[] = [];
  callsArr.push(HandleAPICall(variables, [], mainCardQuery, signal1));
  if (fetchingOngoing) {
    const ongoingVariables: APIVariables = {
      ...variables,
      season: undefined,
      seasonYear: undefined,
      status_in: ["RELEASING"],
    };
    callsArr.push(HandleAPICall(ongoingVariables, [], mainCardQuery, signal2));
  }
  await Promise.all(callsArr)
    .then((arr) => {
      if (signal1.aborted || signal2.aborted) return;
      if (fetchingOngoing) {
        const ongoing = arr[1];
        if (isMainCard(ongoing)) {
          dispatch({
            type: "UPDATE_CARDS",
            payload: { cards: ongoing, ongoing: true },
          });
        }
      }
      const currCards = arr[0];
      if (isMainCard(currCards)) {
        dispatch({
          type: "UPDATE_CARDS",
          payload: { cards: currCards, ongoing: false },
        });
      }
      isCallingAPI.current = false;
    })
    .catch((rej) => console.log(rej));
}
// Mock API functions similary to acutal anilist API. only reducers "UPDATE_NEXT_PAGE_AVAILABLE" not called
async function requestMockAPI(
  settings: APIVariables,
  dispatch: React.Dispatch<Actions>,
  isCallingAPI: MutableRefObject<boolean>,
  fetchingOngoing: MutableRefObject<boolean>,
  signal: AbortSignal
) {
  //Sends a request with the variable settings, the API response will return a boolean hasNextPage, this will determine subsequent network request based on scroll position (currently)
  console.log("calling MOCK_API");
  isCallingAPI.current = true;
  await HandleMockAPICall(settings).then((cards) => {
    isCallingAPI.current = false;
    if (signal.aborted) return;
    dispatch({ type: "UPDATE_CARDS", payload: { cards, ongoing: false } });
    console.log("done calling api"); //eslint-disable-line
  });
}

export { requestAniListAPI, requestMockAPI };
