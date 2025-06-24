import { MutableRefObject, useEffect, useRef } from "react";
import requestNewEpisodesCheck from "../utilities/API/requestNewEpisodesCheck";
import { UserPreferences } from "../interfaces/UserPreferencesTypes";
import { Actions } from "../interfaces/initialConfigTypes";
import dayjs from "dayjs";
import { NewEpisodeCards } from "../interfaces/apiResponseTypes";

export default function useCheckUserList(dispatch: React.Dispatch<Actions>) {
  const abortNewEpisode = useRef<null | AbortController>(null);
  const lastNewEpRequest = localStorage.getItem('newEpisodesLastCalled')
  const lastNewEpisodeCards = localStorage.getItem('newEpisodeCards')

  useEffect(() => {
    if(!lastNewEpisodeCards || lastNewEpRequest && dayjs().diff(lastNewEpRequest, 'minutes') >= 10)
      userListLoadAndCheckForUpdates(dispatch, abortNewEpisode);
    else {
     console.log('Reusing old new-release data')
      dispatch({
        type: "TOGGLE_MODAL",
        payload: {
          action: "OPEN",
          entryPoint: "new release",
          data: {
            available: JSON.parse(lastNewEpisodeCards) as NewEpisodeCards[],
            last_called: dayjs(lastNewEpRequest)
          }
        },
      });
    }
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
