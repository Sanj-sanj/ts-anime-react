import { useEffect, useRef } from "react";
import { Actions } from "../interfaces/initialConfigTypes";
import modalNewEpisodesRequest from "../utilities/UserList/modalNewEpisodesRequest";

export default function useCheckUserList(dispatch: React.Dispatch<Actions>) {
  const abortNewEpisode = useRef<null | AbortController>(null);

  useEffect(() => {
    modalNewEpisodesRequest(dispatch, abortNewEpisode);
    return () => {
      if (abortNewEpisode.current) abortNewEpisode.current.abort();
    };
  }, []);
}

