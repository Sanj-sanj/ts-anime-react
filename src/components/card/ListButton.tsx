import { FunctionComponent } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";

const ListButton: FunctionComponent<{ card: MainCard }> = ({ card }) => {
  return (
    <button
      className="absolute -right-3 -top-3 z-30 bg-red-700 rounded-lg"
      onClick={() => console.log(card.title.romaji)}
    >
      W.I.P
    </button>
  );
};
export default ListButton;
