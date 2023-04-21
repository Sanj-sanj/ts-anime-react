import { FunctionComponent } from "react";
import {
  MainCard,
  NextAiringEpisode,
  ShowStatus,
} from "../../interfaces/apiResponseTypes";

function buildCountdownBar(
  status: ShowStatus,
  nextAiringEpisode: NextAiringEpisode
) {
  let faultyStatus = ["FINISHED", "CANCELED", "HIATUS"].find(
    (e) => e === status
  );
  if (nextAiringEpisode === null && status === "RELEASING") {
    faultyStatus = "NO INFO";
  }
  return (
    <div className="bg-sky-600 dark:bg-sky-800 text-center">
      {faultyStatus ? faultyStatus : status}
    </div>
  );
}
const CardDetailsModal: FunctionComponent<{ modalData: MainCard | null }> = ({
  modalData,
}) => {
  return modalData !== null ? (
    <>
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <img
          className="pr-4 w-min"
          src={modalData.coverImage.large || ""}
          alt={modalData.title.romaji || ""}
        />
        <div className="w-full">
          <div className="flex justify-between dark:text-slate-300">
            <h4 className="font-semibold text-2xl pr-2">
              {modalData.title.romaji}
            </h4>
            <div>
              <p>
                <span className="font-semibold">Rating:</span>{" "}
                {modalData.meanScore}/100
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {modalData.status}
              </p>
            </div>
          </div>
          {buildCountdownBar(modalData.status, modalData.nextAiringEpisode)}
        </div>
      </div>
      <input type="search" name="" id="" />
      <button>test</button>
      <input type="search" name="" id="" />
    </>
  ) : null;
};
export default CardDetailsModal;
