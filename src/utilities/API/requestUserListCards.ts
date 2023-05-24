import {
  UserListDetails,
  UserPreferences,
  UserShowStatus,
} from "../../interfaces/UserPreferencesTypes";
import HandleAPICall from "./HandleAPICall";

import { userListQuery } from "./QueryStrings/UserListQuery";
import { UserListCards as UserListCard } from "../../interfaces/apiResponseTypes";

export default async function requestUserListCards(
  ids: { [x in UserShowStatus]: number[] },
  lists: UserPreferences,
  setState: (newList: {
    [x in UserShowStatus]: UserListDetails<number>;
  }) => void,
  signal?: AbortSignal
) {
  console.log("callingANILIST_API: checking user List"); //eslint-disable-line
  const temp = ["WATCHING", "INTERESTED", "COMPLETED", "DROPPED", "SKIPPED"];

  const apiPromiseArr = Object.entries(ids).map(([s, idsArr]) => {
    const call = HandleAPICall(
      { id_in: idsArr, page: 1, perPage: 50 },
      [],
      userListQuery,
      signal
    );
    return [s, call as Promise<UserListCard[]>];
  }) as [UserShowStatus, Promise<UserListCard[]>][];

  await Promise.all(apiPromiseArr.map(([, p]) => p)).then(
    (val) => {
      const final = val.reduce((acc, list, i) => {
        const b = list.reduce((acc, show: UserListCard) => {
          return {
            ...acc,
            [temp[i] as UserShowStatus]: {
              ...acc[temp[i] as UserShowStatus],
              [show.id]: {
                apiResults: show,
                userListDetails: lists[temp[i] as UserShowStatus][show.id],
              },
            },
          };
        }, {} as { [x in UserShowStatus]: UserListDetails<number> });

        if (temp[i] in b) return { ...acc, ...b };
        return { ...acc, [temp[i]]: {} };
      }, {} as { [x in UserShowStatus]: UserListDetails<number> });
      setState(final);
    },
    (rej) => console.log(rej)
  );
}
