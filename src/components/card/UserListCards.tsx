import { MutableRefObject } from "react";
import { UserListParams } from "../../interfaces/apiResponseTypes";
import ListButton from "./ListButton";

const userListToJSXCards = (
  userList: UserListParams,
  lastFocusedCard: MutableRefObject<HTMLButtonElement | null>
) =>
  Object.entries(userList).map(([key, userListDetail]) => (
    <div
      key={key}
      className="dark:text-slate-300 bg-stone-400 dark:bg-slate-900 w-full mt-4 text-center"
    >
      <h2>{key}:</h2>
      <ul>
        {Object.values(userListDetail).map(
          ({ apiResults, userListDetails: { currentEpisode, userScore } }) => {
            const {
              id,
              title,
              status,
              coverImage,
              format,
              episodes,
              nextAiringEpisode,
              meanScore,
            } = apiResults;
            return (
              <li
                key={id}
                className="px-4 py-0.5 flex w-full mb-6 justify-center"
              >
                <div className="flex w-full bg-stone-200 dark:bg-slate-800 p-2 rounded-lg">
                  <img
                    src={coverImage.medium || ""}
                    alt={title.romaji || title.english || ""}
                  />
                  <div className="flex w-full items-center">
                    <div className="w-full flex flex-col justify-around text-left h-full pt-2 pl-4">
                      <div>
                        <p>{title?.romaji || title?.english}</p>
                        <p>
                          {status} · {format}
                        </p>
                      </div>
                      <div>
                        <ListButton
                          card={apiResults}
                          focusHandler={(ref) =>
                            (lastFocusedCard.current = ref)
                          }
                          text="More details"
                        />
                      </div>
                    </div>
                    <div className="w-1/4 h-full flex flex-col justify-evenly">
                      My progress:{" "}
                      <p>{`${currentEpisode || 0} / ${episodes || "?"}`}</p>
                      My score: <p>{userScore || "?"} / 10</p>
                    </div>
                    <div className="w-1/4 h-full flex flex-col justify-evenly">
                      Released:{" "}
                      <p>
                        {`${
                          (nextAiringEpisode?.episode &&
                            nextAiringEpisode.episode - 1) ||
                          (status === "FINISHED" && episodes) ||
                          "?"
                        } / ${episodes || "?"}`}
                      </p>
                      Online score:{" "}
                      <p>{(meanScore && meanScore / 10) || "?"} / 10</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          }
        )}
      </ul>
    </div>
  ));
export default userListToJSXCards;
