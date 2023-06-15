import { FunctionComponent, useEffect, useRef, useState } from "react";
import {
  NewEpisodeCards,
  NextAiringEpisode,
} from "../../interfaces/apiResponseTypes";
import {
  ListDetails,
  ShowListDetails,
  UserShowStatus,
} from "../../interfaces/UserPreferencesTypes";
import { useDispatchContext } from "../../utilities/Context/AppContext";

const NewEpisodeModal: FunctionComponent<{
  modalData: NewEpisodeCards[] | undefined;
  singelShowDetails: ShowListDetails<number> | undefined;
  titlePref: "english" | "romaji";
}> = ({ modalData, singelShowDetails, titlePref }) => {
  if (!modalData || !singelShowDetails) return <></>;

  const dispatch = useDispatchContext();
  const [statefulDetails, setStatefulDetails] = useState<
    ShowListDetails<number>
  >({ ...singelShowDetails });
  const listPrefDispatchIDs = useRef<number[]>([]);

  const updateDetailsOnModalClose = () => {
    listPrefDispatchIDs.current.forEach((id) => {
      if (
        statefulDetails[id].currentEpisode ===
        singelShowDetails[id].currentEpisode
      )
        return;
      dispatch({
        type: "UPDATE_PREFERENCE",
        payload: {
          cardData: statefulDetails[id],
          status: statefulDetails[id].userStatus as UserShowStatus,
        },
      });
    });
  };
  const adjustCurrentEpisodeCount = (
    showDetails: ListDetails,
    id: number,
    nextAiringEpisode: NextAiringEpisode,
    episodes: number | null,
    adjustment: "+" | "-"
  ) => {
    const currEp = showDetails.currentEpisode;
    if (typeof currEp !== "number") return;
    let newCurr = currEp;
    if (adjustment === "+") {
      newCurr += 1;
      if (
        (episodes && newCurr > episodes) ||
        (nextAiringEpisode?.episode && newCurr > nextAiringEpisode.episode - 1)
      ) {
        newCurr--;
      }
    } else if (adjustment === "-") {
      newCurr -= 1;
      if (newCurr < 0) newCurr = 0;
    }
    setStatefulDetails({
      ...statefulDetails,
      [id]: {
        ...showDetails,
        currentEpisode: newCurr,
      },
    });
    if (!listPrefDispatchIDs.current.includes(id)) {
      listPrefDispatchIDs.current.push(id);
    }
  };
  useEffect(() => {
    return updateDetailsOnModalClose();
  }, [statefulDetails]);

  return (
    <div className="w-full text-center dark:text-stone-300">
      <h2 className="font-semibold text-2xl mt-2">
        New episodes available for:
      </h2>
      <ul className="h-full px-2 mb-4">
        {modalData.map(({ id, status, title, nextAiringEpisode, episodes }) => {
          const showDetails = statefulDetails[id];
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
          if (
            showDetails.userStatus === "INTERESTED" &&
            nextAiringEpisode?.episode &&
            nextAiringEpisode.episode > 2
          )
            return;
          return (
            <li key={id} className=" w-full px-3 mt-2">
              <div className="w-full flex flex-col justify-evenly items-center sm:flex-row">
                <p className="sm:text-left sm:w-1/2 font-bold text-lg sm:mr-2">
                  {title[titlePref] || title.romaji || title.english}:{" "}
                </p>
                <hr className="w-11/12 mb-2 sm:my-0 border-red-300 dark:border-white border-2 rounded" />
                <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-stretch sm:ml-4 border-x border-b sm:border-0 rounded-b ">
                  <p className="w-3/4 sm:w-full flex justify-between py-1 px-3 sm:p-0">
                    Progress:
                    <span className="flex ml-3">
                      {showDetails?.currentEpisode || "?"}
                      <button
                        className="border px-1 ml-2 rounded-sm"
                        onClick={() =>
                          adjustCurrentEpisodeCount(
                            showDetails,
                            id,
                            nextAiringEpisode,
                            episodes,
                            "-"
                          )
                        }
                      >
                        -
                      </button>
                      <button
                        className="border px-1 ml-2 rounded-sm"
                        onClick={() =>
                          adjustCurrentEpisodeCount(
                            showDetails,
                            id,
                            nextAiringEpisode,
                            episodes,
                            "+"
                          )
                        }
                      >
                        +
                      </button>
                    </span>
                  </p>{" "}
                  <p className="w-3/4 sm:w-full flex justify-between px-3 py-1 sm:p-0">
                    Latest: <span>{latestEpAndTotalEp}</span>
                  </p>
                </div>
              </div>
              <hr className="w-0 sm:w-full" />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default NewEpisodeModal;
