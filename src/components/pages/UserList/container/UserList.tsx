import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../../../utilities/Context/AppContext";
import {
  ListDetails,
  ShowListDetails,
  UserShowStatus,
} from "../../../../interfaces/UserPreferencesTypes";
import {
  MainCard,
  UserListParams,
} from "../../../../interfaces/apiResponseTypes";
import requestUserListCards from "../../../../utilities/API/requestUserListCards";
import userListCards from "../../../card/UserListCards";
import SortCardsBy from "../../../../utilities/Cards/SortCardsBy";
import UserListPreferences from "../preferenceBar/UserListPreference";

const UserList = () => {
  const {
    user: { lists },
    client,
    sort,
  } = useStateContext();
  const lastFocusedCard = useRef<null | HTMLButtonElement>(null);
  const abortListRequest = useRef<null | AbortController>(null);
  const entries = Object.entries(lists) as [
    UserShowStatus,
    ShowListDetails<number>
  ][];
  const [usableList, setUsableList] = useState(
    entries.reduce(
      (acc, [status]) => ({ ...acc, [status]: [] }),
      {} as UserListParams
    )
  );
  const [displayCards, setDisplayCards] = useState<JSX.Element[]>();

  useEffect(() => {
    if (
      lastFocusedCard.current !== null &&
      client.overlay.modal.active === false
    )
      lastFocusedCard.current.focus();
  }, [client.overlay.modal]);

  useEffect(() => {
    const currList = Object.entries(usableList);
    const newList = currList.reduce((acc, [key, list]) => {
      const temp = Object.values(list);
      const newSortedList = SortCardsBy(sort, temp) as {
        apiResults: MainCard;
        userListDetails: ListDetails;
      }[];
      return { ...acc, [key]: newSortedList };
    }, {} as typeof usableList);
    setDisplayCards(userListCards(newList, lastFocusedCard));
  }, [sort, usableList]);

  useEffect(() => {
    const ids = entries.reduce((acc, [userStatus, entries]) => {
      return { ...acc, [userStatus]: Object.keys(entries) };
    }, {} as { [x in UserShowStatus]: number[] });

    void requestUserListCards(
      ids,
      lists,
      (newList: UserListParams) => setUsableList(newList),
      abortListRequest.current?.signal
    );
    return () => {
      abortListRequest.current?.abort();
    };
  }, []);

  return (
    <>
      <UserListPreferences />
      <div className="w-full flex flex-col items-center md:p-6 overflow-y-scroll h-[90vh]">
        <div className="md:w-full lg:w-9/12 xl:w-2/4"> {displayCards}</div>
      </div>
    </>
  );
};
export default UserList;
