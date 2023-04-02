// // Here we define our query as a multi-line string

import { APIVariables } from "../../interfaces/apiResponseTypes";
import { MainCard, APIPayload } from "../../interfaces/apiResponseTypes";

// // Storing it in a separate .graphql/.gql file is also possible
const query = `
query ($id: Int, $page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int, $format_in: [MediaFormat]) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(id: $id, type: ANIME, season: $season, seasonYear: $seasonYear, format_in: $format_in) {
      id
      type
      title {
        romaji
        english
        native
      }
      season
      seasonYear
      studios {
        nodes {
          name
          isAnimationStudio
          favourites
        }
      }
      genres
      format
      coverImage {
        medium
        large
        color
      }
      status
			averageScore
      meanScore
      trending
      nextAiringEpisode {
        airingAt
        episode
        timeUntilAiring
      }
    }
  }
}


`;

// // Define our query variables and values that will be used in the query request

// Define the config we'll need for our Api request
const url = "https://graphql.anilist.co";

// Make the HTTP Api request

async function handleResponse(response: Response) {
  const json = (await response.json()) as APIPayload;
  if (response.ok) {
    return json;
  } else {
    return Promise.reject(json);
  }
}

function handleData(data: APIPayload): APIPayload {
  return data;
}

function handleError(error: Error) {
  alert("Error, check console");
  console.error(error);
}

export default async function HandleAPICall(
  settings: APIVariables
): Promise<[MainCard[], boolean]> {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: settings,
    }),
  };

  const results = (await fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch(handleError)) as APIPayload;
  const mainCards = results.data.Page.media;
  const hasNextPage = results.data.Page.pageInfo.hasNextPage;

  return [mainCards, hasNextPage];
}
