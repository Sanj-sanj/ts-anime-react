import { FunctionComponent } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";

const Card: FunctionComponent<{ card: MainCard }> = ({ card }) => {
  const {
    title,
    season,
    coverImage,
    type,
    meanScore,
    seasonYear,
    status,
    studios,
  } = card;
  return (
    <li
      className="flex m-2 border-y-8 border-x-4 rounded-lg w-96 "
      style={{
        backgroundColor: coverImage.color || "#44248321",
      }}
    >
      <img
        className="bg-slate-200 rounded-l-md"
        src={coverImage?.medium || "not founds"}
        alt={title.english || title.romaji || "L"}
        style={{
          minHeight: "143px",
          minWidth: "100px",
          maxHeight: "143px",
          maxWidth: "100px",
        }}
      />
      <div className="flex flex-col w-full">
        <h2 className="leading-none text-lg">
          {title.english || title.romaji || "lmao no title"}
        </h2>
        <small>
          <ul className="w-full flex justify-around items-center font-light text-sm">
            <li>{type}</li>
            <li>{seasonYear}</li>
            <li>{status}</li>
          </ul>
        </small>

        <p>{season}</p>
        <p>
          {studios.nodes?.find((studio) => studio.isAnimationStudio)?.name ||
            studios.nodes?.find((studio) => !studio.isAnimationStudio)?.name ||
            "default"}
        </p>
        <p>{meanScore}</p>
      </div>
    </li>
  );
};
export default Card;
