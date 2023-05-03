import { FunctionComponent, useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  MainCard,
  NextAiringEpisode,
  ShowStatus,
} from "../../interfaces/apiResponseTypes";

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
    coverImage,
    title,
    type,
    popularity,
    trending,
  } = modalData;
  const [countdown, setCountdown] = useState<undefined | string>();

  function buildCountdownBar(
    status: ShowStatus,
    nextAiringEpisode: NextAiringEpisode
  ): void {
    type FAULTY = "FINISHED" | "CANCELED" | "HIATUS";
    const faultyStatus: FAULTY[] = ["FINISHED", "CANCELED", "HIATUS"];
    const found = faultyStatus.find((e) => e === status);
    if (found) {
      return setCountdown(found);
    }
    const now = dayjs();
    const then2 = dayjs(
      nextAiringEpisode?.airingAt && nextAiringEpisode.airingAt * 1000
    );
    const days = then2.diff(now, "d"),
      hours = then2.diff(now, "h") % 24,
      mins = then2.diff(now, "m") % 60,
      secs = then2.diff(now, "s") % 60;
    setCountdown(
      `Ep: ${nextAiringEpisode?.episode || "?"} - ${days}d ${hours}h ${
        mins <= 9 ? "0".concat(mins.toString()) : mins
      }m ${secs <= 9 ? "0".concat(secs.toString()) : secs}s`
    );
  }
  useEffect(() => {
    const then = new Date();
    then.setSeconds(nextAiringEpisode?.timeUntilAiring || 0);
    buildCountdownBar(status, nextAiringEpisode);

    const timeout = setInterval(
      () => buildCountdownBar(status, nextAiringEpisode),
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
          <time className="p-1 rounded bg-sky-600 dark:bg-sky-800 inline-block w-full font-mono">
            {countdown}
          </time>
        </div>
      </div>
      <div className="sm:flex-row items-center sm:items-start lg:flex">
        <div className="left-column flex flex-col items-center p-4 mr-1 bg-stone-400 dark:bg-slate-600 sm:float-left lg:float-none lg:w-1/2">
          <div>
            <img
              className="w-min"
              src={coverImage.large || ""}
              alt={title.romaji || ""}
            />
            <p className="flex justify-between">
              <span className="font-semibold">Rating:</span> {meanScore}
              /100
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">Premier:</span>{" "}
              {/* make the next 10 lines into a utility function and use in Card too */}
              {(startDate?.day &&
                dayjs(
                  `${startDate.year}-${startDate.month}-${startDate.day}`
                ).format("MMMM DD, YYYY")) ||
                (startDate?.month &&
                  dayjs(`${startDate?.year}-${startDate.month}`).format(
                    "MMMM YYYY"
                  )) ||
                `${season.slice(0, 1)}${season.slice(1).toLowerCase()}, ${
                  startDate?.year || ""
                }` ||
                "No info"}
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">Status:</span> {status}
            </p>
          </div>
        </div>
        <div className="w-full">
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
