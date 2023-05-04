import { FunctionComponent, useEffect, useState } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";
import {
  formattedStartDate,
  formatStudiosText,
  formattedGenresText,
  formattedStatusText,
} from "../../utilities/Cards/FormattedCardTexts";
import setCountdownText from "../../utilities/Cards/setCountdownText";

const CardDetailsModal: FunctionComponent<{
  modalData: MainCard | undefined;
}> = ({ modalData }) => {
  if (!modalData) return <></>;
  const {
    genres,
    meanScore,
    nextAiringEpisode,
    status,
    season,
    seasonYear,
    studios,
    source,
    startDate,
    description,
    episodes,
    format,
    duration,
    popularity,
    coverImage,
    title,
    type,
  } = modalData;
  const [countdown, setCountdown] = useState<undefined | string>();

  useEffect(() => {
    const then = new Date();
    then.setSeconds(nextAiringEpisode?.timeUntilAiring || 0);
    setCountdownText(status, nextAiringEpisode, setCountdown);
    const timeout = setInterval(
      () => setCountdownText(status, nextAiringEpisode, setCountdown),
      1000
    );
    return () => {
      clearInterval(timeout);
    };
  });

  return (
    <div className="overflow-scroll p-2 dark:text-slate-300 bg-stone-300 dark:bg-slate-800">
      <div className="flex items-center flex-col mb-3">
        <h4 className="font-semibold text-2xl pr-2 text-center mb-1">
          {title.romaji}
        </h4>
        <div className="w-48 min-w-fit text-center">
          <time className="p-1 rounded bg-sky-600 dark:bg-sky-800 text-slate-300 inline-block w-full font-mono">
            {countdown}
          </time>
        </div>
      </div>
      <div className="sm:flex-row items-center sm:items-start lg:flex">
        <div className="left-column flex flex-col items-center p-4 mr-1 bg-stone-400 dark:bg-slate-700 sm:float-left lg:float-none lg:w-1/2">
          <div>
            <p className="flex justify-center">
              {format} {type}
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">Rating:</span> {meanScore}
              /100
            </p>
            <img
              className="w-min"
              src={coverImage.large || ""}
              alt={title.romaji || ""}
            />
            <div className="information text-sm mt-2">
              <p className="flex justify-between">
                <span className="font-semibold">Premier:</span>{" "}
                {formattedStartDate(startDate, season)}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Season:</span> {season}{" "}
                {seasonYear}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Status:</span>{" "}
                {formattedStatusText(status)}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Studio:</span>{" "}
                {formatStudiosText(studios.nodes)}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Source:</span> {source}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Genres:</span>{" "}
                {formattedGenresText(genres, 2).join(", ")}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Episodes:</span>{" "}
                {(nextAiringEpisode?.episode &&
                  nextAiringEpisode?.episode - 1) ||
                  "?"}{" "}
                / {episodes || "?"}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Duration:</span>{" "}
                {duration || "?"} mins
              </p>
            </div>
          </div>
        </div>
        <div className="w-full mt-2 sm:mt-0">
          <p dangerouslySetInnerHTML={{ __html: description || "" }} />
        </div>
      </div>
      <input type="search" name="" id="" />
      <button>test</button>
      <input type="search" name="" id="" />
    </div>
  );
};
export default CardDetailsModal;
