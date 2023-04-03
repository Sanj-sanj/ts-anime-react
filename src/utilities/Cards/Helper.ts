import { MainCard } from "../../interfaces/apiResponseTypes";
import { SortableBy } from "../../interfaces/initialConfigTypes";

function SortCardsBy(sort: SortableBy, cards: MainCard[]) {
  console.log(sort);

  switch (sort) {
    case "Rating":
      cards.sort((a, b) => {
        return b.meanScore - a.meanScore;
      });
      break;
    case "Popularity":
      cards.sort((a, b) => {
        return b.trending - a.trending;
      });
      break;
    case "Countdown":
      cards.sort((a, b) => {
        return b.id - a.id;
      });
      break;

    default:
      break;
  }
}
export default SortCardsBy;
