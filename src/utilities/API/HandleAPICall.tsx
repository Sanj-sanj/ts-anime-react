// // Here we define our query as a multi-line string

import {
  APICalendarLast24Hours,
  APINewEpisodesVariables,
  APIVariables,
  AiringSchedule,
  NewEpisodeCards,
} from "../../interfaces/apiResponseTypes";
import { MainCard, APIPayload } from "../../interfaces/apiResponseTypes";

// // Define our query variables and values that will be used in the query request

// Define the config we'll need for our Api request
const url = "https://graphql.anilist.co";

// Make the HTTP Api request

async function handleResponse(response: Response) {
  const json = (await response.json()) as APIPayload;
  if (response.ok) {
    return json;
  } else {
    console.log("error: ", json.errors);
    return Promise.reject(json);
  }
}

function handleData(data: APIPayload): APIPayload {
  return data;
}

function handleError(error: Error) {
  return new Error(
    `Somethign went wrong with the API request:  \n${error.name} \n${
      error.message
    } \n${error.stack || ""} `
  );
}

export default async function HandleAPICall(
  settings: APIVariables | APINewEpisodesVariables | APICalendarLast24Hours,
  accumulator: (MainCard | NewEpisodeCards)[] = [],
  query: string,
  signal?: AbortSignal
): Promise<(MainCard | NewEpisodeCards | AiringSchedule)[]> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: settings,
    }),
    signal,
  };

  const results = await fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch(handleError);

  const isError = (payload: APIPayload | Error): payload is Error =>
    payload instanceof Error;

  if (isError(results)) {
    return [];
  }
  if (results.data.Page.airingSchedules) {
    return results.data.Page.airingSchedules;
  }

  const cards = results.data.Page.media;
  const hasNextPage = results.data.Page.pageInfo.hasNextPage;

  if (hasNextPage) {
    return await HandleAPICall(
      { ...settings, page: settings.page + 1 },
      [...accumulator, ...cards],
      query,
      signal
    );
  }

  return [...accumulator, ...cards];
}
