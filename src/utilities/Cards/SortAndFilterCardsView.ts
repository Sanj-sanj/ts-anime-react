import { MainCard, Season } from "../../interfaces/apiResponseTypes";
import {
  InitialConfig,
  SortableBy,
  ValidFormats,
} from "../../interfaces/initialConfigTypes";
import SortCardsBy from "./SortCardsBy";

const sortAndFilterCardsForView = (
  sort: SortableBy,
  ammount: number,
  { cards }: Pick<InitialConfig, "cards">,
  {
    season,
    format,
    seasonYear,
  }: { season: Season; format: ValidFormats; seasonYear: number },
  showOngoing: boolean
) => {
  let cardsToDisplay: MainCard[];
  if (showOngoing) {
    const filteredAiringList = cards[season][seasonYear][format].filter(
      (sCard) => !cards.ONGOING[format].find((oCard) => oCard.id === sCard.id)
    );
    const airingAndOngoing =
      cards.ONGOING[format]?.concat(filteredAiringList) || [];
    cardsToDisplay = SortCardsBy(sort, airingAndOngoing) as MainCard[];
  } else {
    const targ = cards[season][seasonYear][format];
    cardsToDisplay = SortCardsBy(sort, targ) as MainCard[];
  }
  return cardsToDisplay.slice(0, ammount);
};

export default sortAndFilterCardsForView;
