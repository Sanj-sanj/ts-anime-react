import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../../../utilities/Context/AppContext";
import {
  ShowListDetails,
  UserShowStatus,
} from "../../../../interfaces/UserPreferencesTypes";
import { UserListParams } from "../../../../interfaces/apiResponseTypes";
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

  useEffect(() => {
    setUsableList(SortCardsBy(client.sort, usableList) as UserListParams);
  }, [lists, client.sort]);

  useEffect(() => {
    const ids = entries.reduce((acc, [userStatus, entries]) => {
      return { ...acc, [userStatus]: Object.keys(entries) };
    }, {} as { [x in UserShowStatus]: number[] });
    void requestUserListCards(
      ids,
      lists,
      (newList: UserListParams) =>
        setUsableList(SortCardsBy(client.sort, newList) as UserListParams),
      abortListRequest.current?.signal
    );
    return () => {
      abortListRequest.current?.abort();
    };
  }, []);

  const CardContainer = ({
    title,
    children,
  }: {
    title: string;
    children: JSX.Element[];
  }) => (
    <div className="dark:text-slate-300 bg-stone-400 dark:bg-slate-900 w-full pb-4 mt-4 text-center rounded px-6">
      <h2 className="text-xl pt-2">{title}:</h2>
      <ul>{children}</ul>
    </div>
  );
  return (
    <>
      <UserListPreferences />
      <div className="w-full flex flex-col items-center overflow-y-scroll h-[90vh]">
        <div className="w-full sm:w-11/12 md:w-10/12 lg:w-2/3 xl:w-5/12">
          <CardContainer title="Watching">
            {userListCards(
              usableList.WATCHING,
              client.titlesLang,
              lastFocusedCard
            )}
          </CardContainer>
          <CardContainer title="Interested">
            {userListCards(
              usableList.INTERESTED,
              client.titlesLang,
              lastFocusedCard
            )}
          </CardContainer>
          <CardContainer title="Completed">
            {userListCards(
              usableList.COMPLETED,
              client.titlesLang,
              lastFocusedCard
            )}
          </CardContainer>
          <CardContainer title="Skipped">
            {userListCards(
              usableList.SKIPPED,
              client.titlesLang,
              lastFocusedCard
            )}
          </CardContainer>
          <CardContainer title="Dropped">
            {userListCards(
              usableList.DROPPED,
              client.titlesLang,
              lastFocusedCard
            )}
          </CardContainer>
        </div>
      </div>
    </>
  );
};
export default UserList;
