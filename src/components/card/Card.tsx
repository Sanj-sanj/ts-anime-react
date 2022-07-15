import { FunctionComponent } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";

const Card: FunctionComponent<{ card: MainCard }> = ({ card }) => {
  const {
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

  return (
    <li className="flex rounded-lg mb-2 border-2 border-slate-200 bg-stone-100 dark:bg-zinc-900 dark:border-slate-700 dark:text-slate-300 w-3/4">
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
      <div className="flex flex-col w-full overflow-hidden border-l-2">
        <div
          className="p-2 rounded-tr-md"
          style={{
            backgroundColor: coverImage.color || "#44248321",
          }}
        >
          <h2
            className="leading-none text-lg whitespace-nowrap text-ellipsis overflow-hidden dark:mix-blend-difference"
            title={title.english || title.romaji || "lmao no title"}
          >
            {title.english || title.romaji || "lmao no title"}
          </h2>
          <hr />
        </div>

        <div className="h-full flex flex-col justify-around px-2">
          <small>
            <ul className="w-full flex items-baseline justify-between font-light text-xs">
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
              <li>{status}</li>
            </ul>
          </small>

          <p>Rating: {meanScore}/100</p>
          <ul className="flex w-full text-sm font-light ">
            {genres.length ? (
              genres.map((genre) => (
                <li
                  key={genre}
                  className="mr-2 px-1 bg-zinc-100 dark:bg-zinc-800 border border-blue-600 rounded flex text-center "
                >
                  {genre}
                </li>
              ))
            ) : (
              <li className="mr-2 px-1 bg-zinc-100 dark:bg-zinc-800 border border-blue-600 rounded flex text-center">
                {"No genre found"}
              </li>
            )}
          </ul>
        </div>
      </div>
    </li>
  );
};
export default Card;
