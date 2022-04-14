// // Here we define our query as a multi-line string

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
  // return response.json().then(function (json) {
  //   console.log(json);
  //   return response.ok ? json : Promise.reject(json);
  // });
}

function handleData(data: apiPayload) {
  // console.log(data);
  return data;
}

function handleError(error: Error) {
  alert("Error, check console");
  console.error(error);
}

export default async function requestAnime(
  acc = [] as mainCard[],
  page = 1
): Promise<mainCard[]> {
  const variables = {
    page: page,
    perPage: 50,
    season: "WINTER",
    seasonYear: 2022,
  };
  // console.log(variables);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  };

  const results = (await fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch(handleError)) as apiPayload;
  console.log(acc);
  if (results.data) {
    if (!results.data.Page.pageInfo.hasNextPage) {
      return acc.concat(results.data.Page.media);
    } else {
      page++;
      return await requestAnime(acc.concat(results.data.Page.media), page);
    }
  } else {
    return acc;
  }
}
