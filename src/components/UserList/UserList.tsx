import { Link } from "react-router-dom";
import { useStateContext } from "../../utilities/Context/AppContext";

import {
  ListDetails,
  ShowListDetails,
  UserListDetails,
  UserShowStatus,
} from "../../interfaces/UserPreferencesTypes";
import { useEffect, useRef, useState } from "react";
import requestUserListCards from "../../utilities/API/requestUserListCards";

type UserListEntry = Pick<
  ListDetails,
  "title" | "id" | "currentEpisode" | "userScore" | "showAiringStatus"
>;
const UserList = () => {
  const {
    user: { lists },
  } = useStateContext();
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

  const formattedEntries = entries.reduce((acc, [userShowStatus, entries]) => {
    const shows = Object.values(entries).map(
      ({ title, id, userScore, currentEpisode, showAiringStatus }) => ({
        title,
        id,
        currentEpisode,
        userScore,
        showAiringStatus,
      })
    );
    return { ...acc, [userShowStatus]: shows };
  }, {} as { [x in UserShowStatus]: UserListEntry[] });

  const formatEntriesToJSX = (
    userShowStatus: UserShowStatus,
    shows: UserListEntry[]
  ) => (
    <div
      key={userShowStatus}
      className="dark:text-slate-300 bg-stone-400 dark:bg-slate-700 w-full mt-4 text-center"
    >
      <h2>{userShowStatus}:</h2>
      <ul>
        {shows.map(
          ({ title, id, currentEpisode, showAiringStatus, userScore }) => (
            <li key={id} className="px-4 py-0.5 flex w-full justify-between">
              <p>{title?.romaji || title?.english}</p>
              <p>
                {showAiringStatus}{" "}
                {userShowStatus === "WATCHING"
                  ? `Progress: ${currentEpisode || 0}`
                  : ""}
              </p>
            </li>
          )
        )}
      </ul>
    </div>
  );
  return (
    <div className="w-full flex flex-col items-center p-6">
      {formatEntriesToJSX("WATCHING", formattedEntries.WATCHING)}
      {formatEntriesToJSX("INTERESTED", formattedEntries.INTERESTED)}
      {formatEntriesToJSX("COMPLETED", formattedEntries.COMPLETED)}
      {formatEntriesToJSX("DROPPED", formattedEntries.DROPPED)}
      {formatEntriesToJSX("SKIPPED", formattedEntries.SKIPPED)}
    </div>
  );
};
export default UserList;
