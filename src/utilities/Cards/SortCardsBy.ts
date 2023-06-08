import { ListDetails } from "../../interfaces/UserPreferencesTypes";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { SortableBy } from "../../interfaces/initialConfigTypes";
import { isMainCard } from "./CheckCardType";

function SortCardsBy(
  sort: SortableBy,
  cards: MainCard[] | { userListDetails: ListDetails; apiResults: MainCard }[]
) {
  let sortedMainCards: MainCard[] = [];
  let sortedUserListCards: {
    userListDetails: ListDetails;
    apiResults: MainCard;
  }[] = [];
  if (cards.length && isMainCard(cards)) {
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
    switch (sort) {
      case "Rating":
        sortedUserListCards = cards.sort(
          (a, b) =>
            (b.apiResults.meanScore as number) -
            (a.apiResults.meanScore as number)
        );
        break;
      case "Popularity":
        sortedUserListCards = cards
          .filter(
            ({ apiResults: { nextAiringEpisode } }) =>
              nextAiringEpisode?.timeUntilAiring
          )
          .sort(
            (a, b) =>
              (a.apiResults.nextAiringEpisode?.timeUntilAiring as number) -
              (b.apiResults.nextAiringEpisode?.timeUntilAiring as number)
          )
          .concat(
            cards.filter(
              ({ apiResults: { nextAiringEpisode } }) =>
                !nextAiringEpisode?.timeUntilAiring
            )
          );
        break;
      case "Countdown":
        sortedUserListCards = cards.sort(
          (a, b) =>
            (a.apiResults.nextAiringEpisode?.timeUntilAiring as number) -
            (b.apiResults.nextAiringEpisode?.timeUntilAiring as number)
        );
        break;
      default:
        break;
    }
    return sortedUserListCards;
  }
}
export default SortCardsBy;
