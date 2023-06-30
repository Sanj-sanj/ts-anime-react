import { MainCard, UserListParams } from "../../interfaces/apiResponseTypes";
import { SortableBy } from "../../interfaces/initialConfigTypes";
import { isMainCard } from "./CheckCardType";

function SortCardsBy(sort: SortableBy, cards: MainCard[] | UserListParams) {
  let sortedMainCards: MainCard[] = [];
  const sortedUserListCards: UserListParams = {
    WATCHING: [],
    INTERESTED: [],
    SKIPPED: [],
    COMPLETED: [],
    DROPPED: [],
  };
  if (Array.isArray(cards) && cards.length && isMainCard(cards)) {
    switch (sort) {
      case "Rating":
        sortedMainCards = cards
          .filter(({ meanScore }) => meanScore)
          .sort((a, b) => (b.meanScore as number) - (a.meanScore as number))
          .concat(cards.filter(({ meanScore }) => !meanScore));
        break;
      case "Popularity":
        sortedMainCards = cards
          .filter(({ popularity }) => popularity)
          .sort((a, b) => (b.popularity as number) - (a.popularity as number))
          .concat(cards.filter(({ popularity }) => !popularity));
        break;
      case "Countdown":
        sortedMainCards = cards
          .filter(({ nextAiringEpisode }) => nextAiringEpisode?.timeUntilAiring)
          .sort(
            (a, b) =>
              (a.nextAiringEpisode?.timeUntilAiring as number) -
              (b.nextAiringEpisode?.timeUntilAiring as number)
          )
          .concat(
            cards.filter(
              ({ nextAiringEpisode }) => !nextAiringEpisode?.timeUntilAiring
            )
          );
        break;

      default:
        break;
    }
    return sortedMainCards;
  } else {
    cards = cards as typeof sortedUserListCards;
    const temp = Object.entries(cards);
    switch (sort) {
      case "Rating": {
        return temp.reduce((acc, [key, listData]) => {
          listData.sort(
            (a, b) =>
              (b.apiResults.meanScore as number) -
              (a.apiResults.meanScore as number)
          );
          return { ...acc, [key]: listData };
        }, {});
      }

      case "Popularity": {
        return temp.reduce(
          (acc, [key, cards]) => ({
            ...acc,
            [key]: cards
              .filter(
                ({ apiResults: { nextAiringEpisode } }) =>
                  nextAiringEpisode?.timeUntilAiring
              )
              .sort(
                (a, b) =>
                  (b.apiResults.nextAiringEpisode?.timeUntilAiring as number) -
                  (a.apiResults.nextAiringEpisode?.timeUntilAiring as number)
              )
              .concat(
                cards.filter(
                  ({ apiResults: { nextAiringEpisode } }) =>
                    !nextAiringEpisode?.timeUntilAiring
                )
              ),
          }),
          {}
        );
      }

      case "Countdown":
        return temp.reduce((acc, [key, cards]) => {
          const ongoing = cards.filter(
            ({ apiResults: { nextAiringEpisode } }) =>
              nextAiringEpisode?.airingAt
          );
          const sortedCards = [...ongoing]
            .sort(
              (a, b) =>
                (a.apiResults.nextAiringEpisode?.timeUntilAiring as number) -
                (b.apiResults.nextAiringEpisode?.timeUntilAiring as number)
            )
            .concat(
              cards.filter(
                ({ apiResults: { nextAiringEpisode } }) =>
                  !nextAiringEpisode?.airingAt
              )
            );
          return {
            ...acc,
            [key]: sortedCards,
          };
        }, {});

      default:
        break;
    }
  }
}
export default SortCardsBy;
