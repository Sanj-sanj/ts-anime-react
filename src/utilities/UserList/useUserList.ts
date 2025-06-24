import { useEffect, useRef, useState } from "react";
import requestUserListCards from "../API/requestUserListCards";
import { ShowListDetails, UserListDetails, UserPreferences, UserShowStatus } from "../../interfaces/UserPreferencesTypes";
import SortCardsBy from "../Cards/SortCardsBy";
import { SortableBy } from "../../interfaces/initialConfigTypes";

export default function useUserList(
  lists: UserPreferences,
  sort: SortableBy
) {
  const isCallingAPI = useRef(true)
  const abortListRequest = useRef<null | AbortController>(null);
  const entries = Object.entries(lists) as [
    UserShowStatus,
    ShowListDetails<number>
  ][];
  const [usableList, setUsableList] = useState(
    entries.reduce(
      (acc, [status]) => ({ ...acc, [status]: [] }),
      {} as UserListDetails
    )
  );

  useEffect(() => {
    let numberOfShowsToRequest = 0;
    const showIDsForRequest = entries.reduce((acc, [userStatus, entries]) => {
      const allIDs = Object.keys(entries);
      numberOfShowsToRequest += allIDs.length;
      return { ...acc, [userStatus]: allIDs };
    }, {} as { [x in UserShowStatus]: number[] });

    if(numberOfShowsToRequest > 0)
      void requestUserListCards(
        showIDsForRequest,
        lists,
        (newList: UserListDetails) =>
          setUsableList(SortCardsBy(sort, newList) as UserListDetails),
        isCallingAPI,
        abortListRequest.current?.signal,
      );
    return () => {
      abortListRequest.current?.abort();
    };
  }, [lists, sort]);

 return { usableList, isCallingAPI };
}
