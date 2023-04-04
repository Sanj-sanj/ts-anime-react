import { MainCard } from "../../interfaces/apiResponseTypes";
import { SortableBy } from "../../interfaces/initialConfigTypes";

function SortCardsBy(sort: SortableBy, cards: MainCard[]) {
  const sortedCards = [...cards];
  switch (sort) {
    case "Rating":
      sortedCards.sort((a, b) => {
        return b.meanScore - a.meanScore;
      });
      break;
    case "Popularity":
      sortedCards.sort((a, b) => {
        return b.trending - a.trending;
      });
      break;
    case "Countdown":
      sortedCards.sort((a, b) => {
        return b.id - a.id;
      });
      break;

    default:
      break;
  }
  return sortedCards;
}
export default SortCardsBy;
