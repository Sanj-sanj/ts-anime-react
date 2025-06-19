import { MutableRefObject, useEffect, useRef } from "react";
import requestNewEpisodesCheck from "../utilities/API/requestNewEpisodesCheck";
import { UserPreferences } from "../interfaces/UserPreferencesTypes";
import { Actions } from "../interfaces/initialConfigTypes";

export default function useCheckUserList(dispatch: React.Dispatch<Actions>) {
  const abortNewEpisode = useRef<null | AbortController>(null);

  useEffect(() => {
    userListLoadAndCheckForUpdates(dispatch, abortNewEpisode);
    return () => {
      if (abortNewEpisode.current) abortNewEpisode.current.abort();
    };
  }, []);
}

function userListLoadAndCheckForUpdates(
  dispatch: React.Dispatch<Actions>,
  abortNewEpisode: MutableRefObject<null | AbortController>
) {
  abortNewEpisode.current = new AbortController();
  const listHistory = localStorage.getItem("userList");
  if (listHistory) {
    const list = JSON.parse(listHistory) as UserPreferences;
    dispatch({ type: "LOAD_LIST", payload: list });
    void requestNewEpisodesCheck(
      Object.keys(list.WATCHING)
        .concat(Object.keys(list.INTERESTED))
        .map((n) => +n),
      list,
      dispatch,
      abortNewEpisode.current.signal
    );
  }
}
