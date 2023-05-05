import { MainCard } from "../../interfaces/apiResponseTypes";
import { SortableBy } from "../../interfaces/initialConfigTypes";

function SortCardsBy(sort: SortableBy, cards: MainCard[]) {
  let sortedCards: MainCard[] = [];

  switch (sort) {
    case "Rating":
      sortedCards = cards
        .filter(({ meanScore }) => meanScore)
        .sort((a, b) => (b.meanScore as number) - (a.meanScore as number))
        .concat(cards.filter(({ meanScore }) => !meanScore));
      break;
    case "Popularity":
      sortedCards = cards
        .filter(({ popularity }) => popularity)
        .sort((a, b) => (b.popularity as number) - (a.popularity as number))
        .concat(cards.filter(({ popularity }) => !popularity));
      break;
    case "Countdown":
      sortedCards = cards
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
  return sortedCards;
}
export default SortCardsBy;
