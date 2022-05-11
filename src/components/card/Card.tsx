import { FunctionComponent } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";

const Card: FunctionComponent<{ card: MainCard; key: number }> = ({ card }) => {
  const {
    id,
    title,
    season,
    coverImage,
    genres,
    type,
    meanScore,
    seasonYear,
    status,
    studios,
  } = card;
  console.log(id);
  return (
    <li
      className="flex relative m-2 border-y-8 border-x-8 rounded-lg  w-full sm:w-10/12 md:w-2/5"
      style={{
        backgroundColor: coverImage.color || "#44248321",
      }}
    >
      <img
        className="bg-slate-200 rounded-l-md w-full"
        src={coverImage?.medium || "not founds"}
        alt={title.english || title.romaji || title.romaji || "Title not found"}
        style={{
          minHeight: "143px",
          minWidth: "100px",
          maxHeight: "143px",
          maxWidth: "100px",
        }}
      />
      <div className="flex flex-col w-full overflow-hidden p-1 justify-around">
        <h2
          className="leading-none text-lg whitespace-nowrap text-ellipsis overflow-hidden"
          title={title.english || title.romaji || "lmao no title"}
        >
          {title.english || title.romaji || "lmao no title"}
        </h2>
        <small>
          <ul className="w-full flex items-center justify-between font-light text-sm">
            <div>
              <li>
                {season} {type} - {seasonYear}
              </li>
              <li>
                Studio:{" "}
                {studios.nodes?.find((studio) => studio.isAnimationStudio)
                  ?.name ||
                  studios.nodes?.find((studio) => !studio.isAnimationStudio)
                    ?.name ||
                  "default"}
              </li>
            </div>
            <div className="">
              <li>Status: {status}</li>
            </div>
          </ul>
        </small>

        <p>{meanScore}</p>
        <ul className="flex w-full text-sm font-light ">
          {genres.length ? (
            genres.map((genre) => (
              <li className="mr-2 px-1 bg-zinc-100 border border-blue-600 rounded flex text-center ">
                {genre}
              </li>
            ))
          ) : (
            <li className="mr-2 px-1 bg-zinc-100 border border-blue-600 rounded flex text-center">
              {"No genre found"}
            </li>
          )}
        </ul>
      </div>
    </li>
  );
};
export default Card;
