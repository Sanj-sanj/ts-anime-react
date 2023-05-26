import {
  UserListDetails,
  UserPreferences,
  UserShowStatus,
} from "../../interfaces/UserPreferencesTypes";
import { mainCardQuery } from "./QueryStrings/MainCardQuery";
import { UserListCards as UserListCard } from "../../interfaces/apiResponseTypes";

import HandleAPICall from "./HandleAPICall";

export default async function requestUserListCards(
  ids: { [x in UserShowStatus]: number[] },
  lists: UserPreferences,
  setState: (newList: {
    [x in UserShowStatus]: UserListDetails<number>;
  }) => void,
  signal?: AbortSignal
) {
  console.log("callingANILIST_API: checking user List"); //eslint-disable-line
  const status = ["WATCHING", "INTERESTED", "COMPLETED", "DROPPED", "SKIPPED"];

  const apiPromiseArr = Object.entries(ids).map(([showStatus, idsArr]) => {
    const apiCall = HandleAPICall(
      { id_in: idsArr, page: 1, perPage: 50 },
      [],
      mainCardQuery,
      signal
    );
    return [showStatus, apiCall as Promise<UserListCard[]>];
  }) as [UserShowStatus, Promise<UserListCard[]>][];

  await Promise.all(apiPromiseArr.map(([, p]) => p)).then(
    (apiCardListArr) => {
      const final = apiCardListArr.reduce((acc, list, i) => {
        const userListDetailsByStatus = list.reduce(
          (acc, show: UserListCard) => {
            return {
              ...acc,
              [status[i] as UserShowStatus]: {
                ...acc[status[i] as UserShowStatus],
                [show.id]: {
                  apiResults: show,
                  userListDetails: lists[status[i] as UserShowStatus][show.id],
                },
              },
            };
          },
          {} as { [x in UserShowStatus]: UserListDetails<number> }
        );

        if (status[i] in userListDetailsByStatus)
          return { ...acc, ...userListDetailsByStatus };
        return { ...acc, [status[i]]: {} };
      }, {} as { [x in UserShowStatus]: UserListDetails<number> });
      setState(final);
    },
    (rej) => console.log(rej)
  );
}
