import { FunctionComponent, MutableRefObject } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";
import ListButton from "./ListButton";
import dayjs from "dayjs";

const Card: FunctionComponent<{
  card: MainCard;
  focusRef: MutableRefObject<null | HTMLButtonElement>;
}> = ({ card, focusRef }) => {
  const {
    title,
    season,
    coverImage,
    genres,
    type,
    meanScore,
    seasonYear,
    status,
    startDate,
    studios,
    format,
    nextAiringEpisode,
    episodes,
  } = card;

  const date = nextAiringEpisode?.airingAt ? new Date() : "";
  typeof date === "object"
    ? date.setSeconds(nextAiringEpisode?.timeUntilAiring || 0)
    : null;
  const date2 =
    (startDate?.day &&
      dayjs(`${startDate.year}-${startDate.month}-${startDate.day}`).format(
        "ddd, MMMM D, YYYY"
      )) ||
    (startDate?.month &&
      dayjs(`${startDate.year}-${startDate.month}`).format("MMMM, YYYY")) ||
    `${season.slice(0, 1)}${season.slice(1).toLowerCase()}, ${
      startDate?.year || ""
    }` ||
    "No info";
  return (
    <li className="flex relative rounded-lg my-2 md:mx-2 border-2 border-slate-300 bg-stone-100 dark:bg-zinc-900 dark:border-slate-700 dark:text-slate-300 w-full max-w-md max-h-[147px]">
      <ListButton
        card={card}
        focusHandler={(ref: HTMLButtonElement) => {
          focusRef.current = ref;
        }}
      />
      <div className="relative">
        <img
          className="bg-slate-200 rounded-l-md w-full max-h-[143px] min-h-[143px] min-w-[100px] max-w-[100px]"
          src={coverImage?.medium || ""}
          alt={
            title.english || title.romaji || title.romaji || "Title not found"
          }
        />
        <span
          className="absolute bottom-1 left-1 bg-slate-100 text-sm opacity-70 rounded-md text-slate-800 px-1"
          role="img"
          aria-label="format emoji"
        >
          {format || "tv"} 📺
        </span>
      </div>
      <div className="flex flex-col w-full overflow-hidden border-l-2">
        <div
          className="p-2 rounded-tr-md"
          style={{
            backgroundColor: coverImage.color || "#44248321",
          }}
        >
          <h2
            className="leading-none pl-0.5 text-lg whitespace-nowrap text-ellipsis overflow-hidden text-slate-300 [text-shadow:-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]"
            title={title.english || title.romaji || "Title unknown"}
          >
            {title.english || title.romaji || "Title unknown"}
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
                <li className="whitespace-pre-line">
                  Studio:{" "}
                  {studios.nodes?.find((studio) => studio.isAnimationStudio)
                    ?.name ||
                    studios.nodes?.find((studio) => !studio.isAnimationStudio)
                      ?.name ||
                    "Unknown"}
                </li>
                <li>{meanScore ? `${meanScore}/100` : "No score"}</li>
              </div>
              <div className="text-right">
                <li>
                  {status === "NOT_YET_RELEASED"
                    ? "PREMIERS"
                    : status === "RELEASING"
                    ? `EP: ${nextAiringEpisode?.episode || "?"} / ${
                        episodes || "?"
                      }`
                    : status}
                </li>
                <li>{date2}</li>
              </div>
            </ul>
          </small>
          <ul className="flex w-full text-sm font-light overflow-auto">
            {genres.length ? (
              genres.map((genre) => (
                <li
                  key={genre}
                  className="mr-2 px-1 bg-zinc-200 dark:bg-zinc-800 border border-blue-600 rounded flex text-center"
                >
                  {genre}
                </li>
              ))
            ) : (
              <li className="mr-2 px-1 bg-zinc-200 dark:bg-zinc-800 border border-blue-600 rounded flex text-center">
                {"Unknown"}
              </li>
            )}
          </ul>
        </div>
      </div>
    </li>
  );
};
export default Card;
