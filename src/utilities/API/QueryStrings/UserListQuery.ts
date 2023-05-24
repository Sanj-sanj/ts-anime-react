export const userListQuery = `
query ($id_in: [Int], $page: Int, $perPage: Int,) {
    Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media ( id_in: $id_in) {
            id
            title {
                romaji
                english
            }
            status
            episodes
            nextAiringEpisode {
                id
                airingAt
                timeUntilAiring
                episode
            }
            coverImage {
                medium
                large
                color
            }
            format
            meanScore
            averageScore
            popularity
        }
    }
}`;
