import { APIVariables, MainCard } from "../../interfaces/apiResponseTypes";
import { Actions } from "../../interfaces/initialConfigTypes";
import HandleMockAPICall from "./HandleMockAPICall";
import HandleAPICall from "./HandleAPICall";

//Request from Anilist API

async function requestAniListAPI(
  settings: APIVariables,
  dispatch: React.Dispatch<Actions>,
  signal?: AbortSignal
) {
  const { format, season, seasonYear } = settings;
  console.log("calling ANILIST_API"); //eslint-disable-line
  const cards = await HandleAPICall(settings, [], signal);

  dispatch({ type: "UPDATE_CARDS", payload: cards });
  dispatch({
    type: "UPDATE_NEXT_PAGE_AVAILABLE",
    payload: { format, season, year: seasonYear, displayClientAmmount: 15 },
  });
}
// this mock API will only return a single season followed by a single format the Mock API will need to be reworked.
async function requestMockAPI(
  settings: APIVariables,
  dispatch: React.Dispatch<Actions>
) {
  //Sends a request with the variable settings, the API response will return a boolean hasNextPage, this will determine subsequent network request based on scroll position (currently)
  console.log("calling MOCK_API"); //eslint-disable-line
  const cards = await HandleMockAPICall(settings);
  // dispatch({ type: "UPDATE_NEXT_PAGE_AVAILABLE", payload: hasNextPage });
  dispatch({ type: "UPDATE_CARDS", payload: cards });
}

export { requestAniListAPI, requestMockAPI };
