import { FunctionComponent, useEffect, useRef, useState } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { ListDetails, UserShowStatus } from "../../interfaces/UserPreferences";
import {
  formattedDate,
  formatStudiosText,
  formattedGenresText,
  formattedStatusText,
  formattedEndDate,
  formatTitleCase,
} from "../../utilities/Cards/FormattedCardTexts";
import setCountdownText from "../../utilities/Cards/setCountdownText";

const CardDetailsModal: FunctionComponent<{
  modalData: MainCard | undefined;
  details: [UserShowStatus, ListDetails] | undefined;
}> = ({ modalData, details }) => {
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
    endDate,
    episodes,
    format,
    duration,
    coverImage,
    title,
    type,
  } = modalData;
  const [countdown, setCountdown] = useState<undefined | string>();
  const detailsAndImageContainer = useRef<HTMLDivElement | null>(null);
  const [userShowStatus, listDetails] = details || [undefined, undefined];

  function getNewBGColor(status: UserShowStatus | undefined) {
    if (!status) return ["dark:bg-slate-700", "bg-stone-600"];
    const dict = {
      WATCHING: ["dark:bg-lime-900", "bg-lime-400"],
      INTERESTED: ["dark:bg-indigo-900", "bg-indigo-400"],
      COMPLETED: ["dark:bg-blue-900", "bg-blue-400"],
      DROPPED: ["dark:bg-red-900", "bg-red-400"],
      SKIPPED: ["dark:bg-amber-900", "bg-amber-400"],
    };
    return dict[status];
  }
  useEffect(() => {
    setCountdownText(status, nextAiringEpisode, setCountdown);
    const timeout = setInterval(
      () => setCountdownText(status, nextAiringEpisode, setCountdown),
      1000
    );

    detailsAndImageContainer.current?.classList.add(
      ...getNewBGColor(userShowStatus)
    );

    return () => {
      clearInterval(timeout);
    };
  });

  return (
    <div
      className="overflow-y-scroll p-2 dark:text-slate-300 bg-stone-300 dark:bg-slate-800"
      role="main"
      aria-labelledby="details-content"
      // eslint-disable-next-line
      tabIndex={0}
    >
      <div className="flex items-center flex-col mb-3">
        <h2 className="font-semibold text-2xl pr-2 text-center mb-1">
          {title.romaji}
        </h2>
        <div className="w-48 min-w-fit text-center">
          <time className="p-1 rounded bg-sky-700 text-slate-300 inline-block w-full font-mono">
            {countdown}
          </time>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row">
        <div
          className="left-column flex flex-col items-center p-2 px-3 mr-1 sm:w-1/2 h-full"
          ref={detailsAndImageContainer}
        >
          <div>
            <p className="flex justify-center">
              {format} {type}
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">My status:</span>{" "}
              {formatTitleCase(userShowStatus || "-")}
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">Mean Score:</span> {meanScore}
              /100
            </p>
            <img
              className="w-min"
              src={coverImage.large || ""}
              alt={title.romaji || ""}
            />
            <div className="information text-sm mt-2">
              <p className="flex justify-between">
                <span className="font-semibold">Premiers:</span>{" "}
                {formattedDate(startDate, season)}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Finished:</span>{" "}
                {formattedEndDate(endDate)}
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
                <span className="font-semibold">Source:</span>{" "}
                {formatTitleCase(source)}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Genres:</span>{" "}
                {formattedGenresText(genres, 2).join(", ")}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Episodes:</span>{" "}
                {(status !== "FINISHED" &&
                  nextAiringEpisode?.episode &&
                  `${nextAiringEpisode?.episode - 1} /`) ||
                  (status === "FINISHED" && " ") ||
                  "? /"}{" "}
                {episodes || "?"}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Duration:</span>{" "}
                {duration || "?"} mins
              </p>
            </div>
          </div>
        </div>
        <div className="right-column w-full sm:w-1/2 mt-2 sm:mt-0 p-2">
          <p dangerouslySetInnerHTML={{ __html: description || "" }} />
        </div>
      </div>
      <details className="flex bg-slate-500 rounded-md mt-2 py-2 px-6">
        <summary>My Details</summary>
        <p className="flex justify-between">
          My Score:{" "}
          <span className="font-semibold">{listDetails?.userScore || "-"}</span>
        </p>
        <p className="flex justify-between">
          My Progress:{" "}
          <span className="font-semibold">
            {(listDetails?.currentEpisode &&
              `${listDetails.currentEpisode} / ${episodes || "?"}`) ||
              "-"}
          </span>
        </p>
        <p className="flex justify-between">
          My Start Date:{" "}
          <span className="font-semibold">{listDetails?.startedOn || "-"}</span>
        </p>
        <p className="flex justify-between">
          My Completion Date:{" "}
          <span className="font-semibold">
            {listDetails?.completedOn || "-"}
          </span>
        </p>
        <p className="flex justify-between">
          Rewatched:{" "}
          <span className="font-semibold">
            {listDetails?.rewatches || "0"} times
          </span>
        </p>
        <p className="flex flex-col">
          My Notes:{" "}
          <span className="font-semibold">{listDetails?.notes || "-"}</span>
        </p>
      </details>
      {/* this will load more details about the show but it will also fire off a network request to get those details */}
      <button>load more info... incomplete</button>
    </div>
  );
};
export default CardDetailsModal;
