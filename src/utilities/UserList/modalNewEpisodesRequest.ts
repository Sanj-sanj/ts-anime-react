import { MutableRefObject } from "react";
import { UserPreferences } from "../../interfaces/UserPreferencesTypes";
import { NewEpisodeCards } from "../../interfaces/apiResponseTypes";
import { Actions } from "../../interfaces/initialConfigTypes";
import requestNewEpisodesCheck from "../API/requestNewEpisodesCheck";
import dayjs from "dayjs";

export default function modalNewEpisodesRequest(
  dispatch: React.Dispatch<Actions>,
  abortNewEpisode: MutableRefObject<null | AbortController>
) {
  const lastNewEpRequest = localStorage.getItem('newEpisodesLastCalled')
  const lastNewEpisodeCards = localStorage.getItem('newEpisodeCards')

  if(!lastNewEpisodeCards || lastNewEpRequest && dayjs().diff(lastNewEpRequest, 'minutes') >= 10) {
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
}
