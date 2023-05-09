import { FunctionComponent } from "react";
import { NewEpisodeCards } from "../../interfaces/apiResponseTypes";

const NewEpisodeModal: FunctionComponent<{ modalData: NewEpisodeCards[] }> = ({
  modalData,
}) => {
  return (
    <div className="w-full text-center dark:text-stone-300">
      <h2 className="font-semibold text-2xl">New episodes available for:</h2>
      <ul className="h-full">
        {modalData.map(({ id, status, title, nextAiringEpisode, episodes }) => {
          const currEp =
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
            <li key={id} className="flex justify-between w-full px-6">
              {title.romaji || title.english}, <span>Latest: {currEp}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default NewEpisodeModal;
