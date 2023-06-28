export const airingTodayQuery = `
query ($airingAt_greater: Int, $airingAt_lesser: Int $page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        airingSchedules (airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser) {
            id
            media {
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
            airingAt
            episode
        }
    }
}`;
