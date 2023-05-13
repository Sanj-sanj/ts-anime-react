import { FunctionComponent } from "react";
import { NewEpisodeCards } from "../../interfaces/apiResponseTypes";
import { ShowListDetails } from "../../interfaces/UserPreferences";

const NewEpisodeModal: FunctionComponent<{
  modalData: NewEpisodeCards[];
  userDetails: ShowListDetails<number> | undefined;
}> = ({ modalData, userDetails }) => {
  return (
    <div className="w-full text-center dark:text-stone-300">
      <h2 className="font-semibold text-2xl mt-2">
        New episodes available for:
      </h2>
      <ul className="h-full px-2 mb-4">
        {modalData.map(({ id, status, title, nextAiringEpisode, episodes }) => {
          const listDetail = userDetails?.[id];
          const latestEpAndTotalEp =
            status === "RELEASING" || status === "HIATUS"
              ? `${
                  (nextAiringEpisode?.episode &&
                    nextAiringEpisode?.episode - 1) ||
                  "?"
                } / ${episodes || "?"}`
              : status === "FINISHED"
              ? `${episodes || "?"} / ${episodes || "?"}`
              : "?";
          return (
            <li key={id} className=" w-full px-3 mt-2">
              <div className="w-full flex flex-col justify-evenly items-center sm:flex-row">
                <p className="sm:text-left sm:w-1/2 font-bold text-lg sm:mr-2">
                  {title.romaji || title.english}:{" "}
                </p>
                <hr className="w-11/12 mb-2 sm:my-0 border-red-300 dark:border-white border-2 rounded" />
                <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-stretch sm:ml-4 border-x sm:border-0">
                  <p className="w-3/4 sm:w-full flex justify-between py-1 px-6 sm:p-0">
                    Progress: <button className="border px-1.5">-</button>
                    <span>{listDetail?.currentEpisode}</span>
                    <button className="border px-1.5">+</button>
                  </p>{" "}
                  <p className="w-3/4 flex justify-between px-6 py-1 sm:p-0">
                    Latest: <span>{latestEpAndTotalEp}</span>
                  </p>
                </div>
                <hr className="w-full sm:w-0" />
              </div>
              <hr className="sm:w-full" />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default NewEpisodeModal;
