import { useStateContext } from "../../../../utilities/Context/AppContext";
import userListCards from "../../../card/UserListCards";
import UserListPreferences from "../preferenceBar/UserListPreference";
import useFocus from "../../../../hooks/useFocus";
import useUserList from "../../../../utilities/UserList/useUserList";
import { UserShowStatus } from "../../../../interfaces/UserPreferencesTypes";

// Bug in Component when opening modal view of a show, updating the current progress / score
// does not update the component inside of UserList, Ex: curr Ep 7 => updates to 8, userList still displays 7
const UserList = () => {
  const {
    cards,
    user: { lists },
    client: { sort, titlesLang },
    client
  } = useStateContext();

  const status = ["WATCHING", "INTERESTED", "COMPLETED", "DROPPED", "SKIPPED"] as UserShowStatus[]
  const { lastFocusedElement } = useFocus(client)
  const { usableList } = useUserList(lists, {cards}, sort);

  return (
    <>
      <UserListPreferences />
      <div className="w-full flex flex-col items-center overflow-y-scroll h-[90vh]">
        <div className="w-full sm:w-11/12 md:w-10/12 lg:w-2/3 xl:w-5/12">
          {status.map(showStatus => (
            <div key={showStatus} className="dark:text-slate-300 bg-stone-400 dark:bg-slate-900 w-full pb-4 mt-4 text-center rounded px-6">
              <h2 className="text-xl pt-2">{showStatus}:</h2>
              <ul>{userListCards(usableList[showStatus], titlesLang, lastFocusedElement)}</ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default UserList;
