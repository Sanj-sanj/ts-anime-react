// // Here we define our query as a multi-line string

import { APIVariables } from "../interfaces/apiRequestTypes";
import { mainCard, apiPayload } from "../interfaces/apiResponseTypes";

// // Storing it in a separate .graphql/.gql file is also possible
const query = `
query ($id: Int, $page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(id: $id, type: ANIME, season: $season, seasonYear: $seasonYear) {
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
  const json = (await response.json()) as apiPayload;
  if (response.ok) {
    return json;
  } else {
    return Promise.reject(json);
  }
}

function handleData(data: apiPayload): apiPayload {
  // console.log(data);
  return data;
}

function handleError(error: Error) {
  alert("Error, check console");
  console.error(error);
}

export default async function requestAnime(
  settings: APIVariables
): Promise<[mainCard[], boolean]> {
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
    .catch(handleError)) as apiPayload;
  const mainCards = results.data.Page.media;
  const hasNextPage = results.data.Page.pageInfo.hasNextPage;

  return [mainCards, hasNextPage];
}
