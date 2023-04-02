import { APIVariables } from "../../interfaces/apiResponseTypes";
import { Actions } from "../../interfaces/initialConfigTypes";
import HandleMockAPICall from "./HandleMockAPICall";
import HandleAPICall from "./HandleAPICall";

//Request from Anilist API
async function requestAniListAPI(
  settings: APIVariables,
  dispatch: React.Dispatch<Actions>
) {
  const [res, hasNextPage] = await HandleAPICall(settings);
  console.log("calling ANILIST_API"); //eslint-disable-line
  dispatch({ type: "UPDATE_NEXT_PAGE_AVAILABLE", payload: hasNextPage });
  dispatch({ type: "UPDATE_CARDS", payload: res });
}

function requestMockAPI(
  settings: APIVariables,
  dispatch: React.Dispatch<Actions>
) {
  console.log(settings);
  //Sends a request with the variable settings, the API response will return a boolean hasNextPage, this will determine subsequent network request based on scroll position (currently)
  const [res, hasNextPage] = HandleMockAPICall(settings);
  console.log("calling MOCK_API"); //eslint-disable-line
  dispatch({ type: "UPDATE_NEXT_PAGE_AVAILABLE", payload: hasNextPage });
  dispatch({ type: "UPDATE_CARDS", payload: res });
}

export { requestAniListAPI, requestMockAPI };
