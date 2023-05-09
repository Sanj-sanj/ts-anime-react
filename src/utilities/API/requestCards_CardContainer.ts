import { APIVariables } from "../../interfaces/apiResponseTypes";
import { Actions } from "../../interfaces/initialConfigTypes";
import HandleMockAPICall from "./HandleMockAPICall";
import HandleAPICall from "./HandleAPICall";
import { MutableRefObject } from "react";
import { mainCardQuery } from "./QueryStrings/MainCardQuery";
import { isMainCard } from "../Cards/CheckCardType";

//Request from Anilist API
async function requestAniListAPI(
  settings: APIVariables,
  dispatch: React.Dispatch<Actions>,
  isCallingAPI: MutableRefObject<boolean>,
  signal: AbortSignal
) {
  console.log("calling ANILIST_API"); //eslint-disable-line
  isCallingAPI.current = true;
  await HandleAPICall(settings, [], mainCardQuery, signal).then((cards) => {
    isCallingAPI.current = false;
    if (signal.aborted) return;
    if (!isMainCard(cards)) return [];
    dispatch({ type: "UPDATE_CARDS", payload: cards });
  });
}
// Mock API functions similary to acutal anilist API. only reducers "UPDATE_NEXT_PAGE_AVAILABLE" not called
async function requestMockAPI(
  settings: APIVariables,
  dispatch: React.Dispatch<Actions>,
  isCallingAPI: MutableRefObject<boolean>,
  signal: AbortSignal
) {
  //Sends a request with the variable settings, the API response will return a boolean hasNextPage, this will determine subsequent network request based on scroll position (currently)
  console.log("calling MOCK_API"); //eslint-disable-line
  isCallingAPI.current = true;
  await HandleMockAPICall(settings).then((cards) => {
    isCallingAPI.current = false;
    if (signal.aborted) return;
    dispatch({ type: "UPDATE_CARDS", payload: cards });
    console.log("done calling api"); //eslint-disable-line
  });
}

export { requestAniListAPI, requestMockAPI };
