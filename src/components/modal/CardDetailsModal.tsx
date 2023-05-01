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
    then.setSeconds(modalData.nextAiringEpisode?.timeUntilAiring || 0);
    buildCountdownBar(modalData.status, modalData.nextAiringEpisode);

    const timeout = setInterval(
      () => buildCountdownBar(modalData.status, modalData.nextAiringEpisode),
      1000
    );
    return () => {
      clearInterval(timeout);
    };
  });

  return (
    <div className="overflow-scroll p-2 dark:text-slate-300">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <div className="left-column flex w-full sm:block">
          <img
            className="pr-4 w-min"
            src={modalData.coverImage.large || ""}
            alt={modalData.title.romaji || ""}
          />
          <div>
            <p>
              <span className="font-semibold">Rating:</span>{" "}
              {modalData.meanScore}
              /100
            </p>
            <p>
              <span className="font-semibold">Status:</span> {modalData.status}
            </p>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between ">
            <h4 className="font-semibold text-2xl pr-2">
              {modalData.title.romaji}
            </h4>
          </div>

          <div className="bg-sky-600 dark:bg-sky-800 text-center">
            <time className="w-full font-mono">{countdown}</time>
          </div>
          <p
            dangerouslySetInnerHTML={{ __html: modalData.description || "" }}
          />
        </div>
      </div>
      <input type="search" name="" id="" />
      <button>test</button>
      <input type="search" name="" id="" />
    </div>
  );
};
export default CardDetailsModal;
