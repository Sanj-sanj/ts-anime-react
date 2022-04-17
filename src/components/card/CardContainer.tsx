import { mainCard } from "../../interfaces/apiResponseTypes";
import Card from "./Card";

const CardContainer = (cards: mainCard[]): JSX.Element => {
  console.log("hits");
  return (
    <>
      {cards.map(({ id, title, season, coverImage, type, meanScore }) => (
        <Card
          key={id}
          title={title.english || title.romaji || title.native || "not found"}
          season={season}
          coverImage={coverImage}
          type={type}
          meanScore={meanScore}
        />
      ))}
    </>
  );
};

export default CardContainer;
