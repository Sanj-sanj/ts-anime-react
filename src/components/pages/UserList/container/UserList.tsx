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
    client: { overlay, sort, titlesLang },
  } = useStateContext();

        console.log(lists);
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
  if (lastFocusedCard.current !== null && overlay.modal.active === false)
    lastFocusedCard.current.focus();

    //todo - remove this useEffect to its own file as a hook. 
    //limit the network calls
    //cache the results
    //perhaps rethink the way network calls are being made here to limit the req
    //being sent to the API to prevent user rate limiting 
    //(maybe use placeholder data thats already available in lists 
  useEffect(() => {
    // on page load and when user updates list entry, rebuild the cards and make the necessarry network request.
    let numberOfShowsToRequest = 0;
    const ids = entries.reduce((acc, [userStatus, entries]) => {
      const showIds = Object.keys(entries);
      numberOfShowsToRequest += showIds.length;
      return { ...acc, [userStatus]: showIds };
    }, {} as { [x in UserShowStatus]: number[] });
    if(numberOfShowsToRequest > 0)
      void requestUserListCards(
        ids,
        lists,
        (newList: UserListParams) =>
          setUsableList(SortCardsBy(sort, newList) as UserListParams),
        abortListRequest.current?.signal
      );
    return () => {
      abortListRequest.current?.abort();
    };
  }, [lists, sort]);

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
            {userListCards(usableList.WATCHING, titlesLang, lastFocusedCard)}
          </CardContainer>
          <CardContainer title="Interested">
            {userListCards(usableList.INTERESTED, titlesLang, lastFocusedCard)}
          </CardContainer>
          <CardContainer title="Completed">
            {userListCards(usableList.COMPLETED, titlesLang, lastFocusedCard)}
          </CardContainer>
          <CardContainer title="Skipped">
            {userListCards(usableList.SKIPPED, titlesLang, lastFocusedCard)}
          </CardContainer>
          <CardContainer title="Dropped">
            {userListCards(usableList.DROPPED, titlesLang, lastFocusedCard)}
          </CardContainer>
        </div>
      </div>
    </>
  );
};
export default UserList;
