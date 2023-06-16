import { MutableRefObject } from "react";
import { UserListData } from "../../interfaces/apiResponseTypes";
import ListButton from "./ListButton";
import StarSVG from "../../assets/five_pointed_star.svg";

const userListCards = (
  userList: UserListData,
  titlePref: "english" | "romaji",
  lastFocusedCard: MutableRefObject<HTMLButtonElement | null>
) =>
  Object.values(userList).map(
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
          className="py-0.5 flex w-full justify-between text-xs md:text-base first:rounded-t-lg last:rounded-b-lg bg-stone-200 dark:bg-slate-800 mb-0.5"
        >
          <div className="flex w-full items-center p-2">
            <img
              src={coverImage.medium || ""}
              alt={title[titlePref] || title.romaji || title.english || ""}
              className="max-w-[50px] max-h-[71px] sm:max-h-[106.5px] sm:max-w-[75px] md:max-h-[142px] md:max-w-[100px] rounded"
            />
            <div className="flex w-full items-center justify-between">
              <div className="w-full flex flex-col justify-around text-left h-full sm:pt-2 md:pl-4 px-1">
                <div>
                  <h3
                    className="whitespace-break-spaces line-clamp-2 text-ellipsis overflow-hidden"
                    style={{ contain: "inline-size" }}
                    title={
                      title[titlePref] ||
                      title?.romaji ||
                      title?.english ||
                      "Title not found"
                    }
                  >
                    {title[titlePref] || title?.romaji || title?.english}
                  </h3>
                  <p>
                    <span className="text-blue-400">
                      {status === "NOT_YET_RELEASED" ? "UNRELEASED" : status}
                    </span>{" "}
                    · {format}
                  </p>
                </div>
                <div>
                  <ListButton
                    card={apiResults}
                    focusHandler={(ref) => (lastFocusedCard.current = ref)}
                  />
                </div>
              </div>
              <div className="flex w-full flex-col min-w-fit max-w-[120px]">
                User:{" "}
                <div className="leading-none h-full flex flex-row w-full justify-between">
                  <p>{`${currentEpisode || 0} / ${episodes || "?"}`}</p>
                  <span className="flex w-8 justify-between">
                    {userScore || "?"}{" "}
                    <img
                      src={StarSVG as string}
                      alt=""
                      className="w-3 sm:w-4"
                    />
                  </span>
                </div>
                Online:{" "}
                <div className="leading-none h-full flex flex-row w-full justify-between">
                  <p>
                    {`${
                      (nextAiringEpisode?.episode &&
                        nextAiringEpisode.episode - 1) ||
                      (status === "FINISHED" && episodes) ||
                      "?"
                    } / ${episodes || "?"}`}
                  </p>
                  <span className="flex w-11 justify-between">
                    <p>{(meanScore && meanScore / 10) || "?"}</p>{" "}
                    <img
                      src={StarSVG as string}
                      alt=""
                      className="w-3 sm:w-4"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </li>
      );
    }
  );
export default userListCards;
