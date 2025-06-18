import {
  UserListDetails,
  UserPreferences,
  UserShowStatus,
} from "../../interfaces/UserPreferencesTypes";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { mainCardQuery } from "./QueryStrings/MainCardQuery";
import HandleAPICall from "./HandleAPICall";

export default async function requestUserListCards(
  ids: { [x in UserShowStatus]: number[] },
  lists: UserPreferences,
  setState: (newList: UserListDetails) => void,
  signal?: AbortSignal
) {
  console.log("callingANILIST_API: checking user List"); //eslint-disable-line
  const status = ["WATCHING", "INTERESTED", "COMPLETED", "DROPPED", "SKIPPED"] as UserShowStatus[]

  const apiPromiseArr = Object.entries(ids).map(([showStatus, idsArr]) => {
    const apiCall = HandleAPICall(
      { id_in: idsArr, page: 1, perPage: 50 },
      [],
      mainCardQuery,
      signal
    );
    return [showStatus, apiCall as Promise<MainCard[]>];
  }) as [UserShowStatus, Promise<MainCard[]>][];

  await Promise
    .all(apiPromiseArr.map(([, p]) => p))
    .then( (apiCardListArr) => {
      const final = apiCardListArr.reduce((acc, list, i) => {
        const userListDetailsByStatus = list.reduce((acc, show) => {
          const prevInThisStatus =
            (acc[status[i] ] && [
              ...acc[status[i] ],
            ]) ||
            [];
          return {
            ...acc,
            [status[i] ]: [
              ...prevInThisStatus,
              {
                apiResults: show,
                userListDetails: lists[status[i] ][show.id],
              },
            ],
          };
        }, {} as UserListDetails);
        if (status[i] in userListDetailsByStatus)
          return { ...acc, ...userListDetailsByStatus };
        return { ...acc, [status[i]]: [] };
      }, {} as UserListDetails);
      setState(final);
    },
    (rej) => console.log(rej)
  );
}
