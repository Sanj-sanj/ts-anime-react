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

// Bug in Component when opening modal view of a show, updating the current progress / score
// does not update the component inside of UserList, Ex: curr Ep 7 => updates to 8, userList still displays 7
const UserList = () => {
  const {
    user: { lists },
    client,
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

  if (lastFocusedCard.current !== null && client.overlay.modal.active === false)
    lastFocusedCard.current.focus();

  const currList = Object.entries(usableList);
  const newList = currList.reduce((acc, [key, list]) => {
    const temp = Object.values(list);
    const newSortedList = SortCardsBy(client.sort, temp) as {
      apiResults: MainCard;
      userListDetails: ListDetails;
    }[];
    return { ...acc, [key]: newSortedList };
  }, {} as typeof usableList);
  const displayCards = userListCards(
    newList,
    client.titlesLang,
    lastFocusedCard
  );

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
      <div className="w-full flex flex-col items-center overflow-y-scroll h-[90vh]">
        <div className="w-full sm:w-11/12 md:w-10/12 lg:w-2/3 xl:w-5/12">
          {displayCards}
        </div>
      </div>
    </>
  );
};
export default UserList;
