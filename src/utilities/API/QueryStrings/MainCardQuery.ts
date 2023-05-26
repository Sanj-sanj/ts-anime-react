/**
 * Refrence Docs: https://anilist.github.io/ApiV2-GraphQL-Docs/
 */

// // Storing it in a separate .graphql/.gql file is also possible
export const mainCardQuery = `
query ($id: Int, $id_in:[Int], $page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int, $format_in: [MediaFormat]) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(id: $id, id_in: $id_in, type: ANIME, season: $season, seasonYear: $seasonYear, format_in: $format_in) {
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
      popularity
      episodes
      duration
      modNotes
      description
      source
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      nextAiringEpisode {
        airingAt
        episode
        timeUntilAiring
      }
    }
  }
}
`;
