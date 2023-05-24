import { Link } from "react-router-dom";
import { useStateContext } from "../../utilities/Context/AppContext";
import { useState } from "react";
import {
  ShowListDetails,
  UserShowStatus,
} from "../../interfaces/UserPreferencesTypes";

const UserList = () => {
  const {
    user: { lists },
  } = useStateContext();
  const entries = Object.entries(lists) as [
    UserShowStatus,
    ShowListDetails<number>
  ][];

  const ListAsJSX = entries.map(([userShowStatus, entries]) => {
    const shows = Object.values(entries).map(
      ({ title, id, userScore, currentEpisode }) => ({
        title,
        id,
        currentEpisode,
        userScore,
      })
    );
    return (
      <div key={userShowStatus} className="dark:text-slate-300">
        <h2>{userShowStatus}:</h2>
        <ul>
          {shows.map(({ title, id, currentEpisode }) => (
            <li key={id} className="pl-4">
              <p>{title?.romaji || title?.english}</p>
              <p>
                {userShowStatus === "WATCHING"
                  ? `Progress: ${currentEpisode || 0}`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  });
  return <div>{[...ListAsJSX]}</div>;
};
export default UserList;
