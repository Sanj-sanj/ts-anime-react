import { MainCard } from "../../interfaces/apiResponseTypes";
import Card from "./Card";

const CardContainer = (cards: MainCard[]): JSX.Element => {
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
