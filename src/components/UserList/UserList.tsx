import { Link } from "react-router-dom";
import { useStateContext } from "../../utilities/Context/AppContext";

import {
  ShowListDetails,
  UserListDetails,
  UserShowStatus,
} from "../../interfaces/UserPreferencesTypes";
import { useEffect, useRef, useState } from "react";
import requestUserListCards from "../../utilities/API/requestUserListCards";
import ListButton from "../card/ListButton";

const UserList = () => {
  const {
    user: { lists },
  } = useStateContext();
  const lastFocusedCard = useRef<null | HTMLButtonElement>(null);
  const abortListRequest = useRef<null | AbortController>(null);
  const entries = Object.entries(lists) as [
    UserShowStatus,
    ShowListDetails<number>
  ][];

  const [usableList, setUsableList] = useState(
    entries.reduce(
      (acc, [status]) => ({ ...acc, [status]: {} }),
      {} as { [x in UserShowStatus]: UserListDetails<number> }
    )
  );

  useEffect(() => {
    const ids = entries.reduce((acc, [userStatus, entries]) => {
      return { ...acc, [userStatus]: Object.keys(entries) };
    }, {} as { [x in UserShowStatus]: number[] });

    void requestUserListCards(
      ids,
      lists,
      (newList: typeof usableList) => setUsableList(newList),
      abortListRequest.current?.signal
    );
    return () => {
      abortListRequest.current?.abort();
    };
  }, []);

  const formatEntriesToJSX = (userList: typeof usableList) =>
    Object.entries(userList).map(([key, userListDetail]) => (
      <div
        key={key}
        className="dark:text-slate-300 bg-stone-400 dark:bg-slate-900 w-full mt-4 text-center"
      >
        <h2>{key}:</h2>
        <ul>
          {Object.values(userListDetail).map(
            ({
              apiResults,
              userListDetails: { currentEpisode, userScore },
            }) => {
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
                      <div className="w-full flex flex-col text-left h-full pt-2 pl-4">
                        <p>{title?.romaji || title?.english}</p>
                        <p>
                          {status} {format}
                        </p>
                        <ListButton
                          card={apiResults}
                          focusHandler={(ref) =>
                            (lastFocusedCard.current = ref)
                          }
                        />
                      </div>
                      <div className="w-1/4 h-full flex flex-col justify-evenly">
                        My progress:{" "}
                        <p>{`${currentEpisode || 0} / ${episodes || "?"}`}</p>
                        Online score:{" "}
                        <p>{(meanScore && meanScore / 10) || "?"} / 10</p>
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
                        My score: <p>{userScore || "?"} / 10</p>
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
  return (
    <div className="w-full flex flex-col items-center p-6 overflow-y-scroll h-[90vh]">
      <div className="w-full bg-stone-700">
        {" "}
        <Link to={"/"}>main page</Link>
      </div>
      {formatEntriesToJSX(usableList)}
    </div>
  );
};
export default UserList;
