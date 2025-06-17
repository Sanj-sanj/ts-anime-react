import { useEffect, useRef, useState } from "react";
import requestUserListCards from "../API/requestUserListCards";
import { ShowListDetails, UserPreferences, UserShowStatus } from "../../interfaces/UserPreferencesTypes";
import { Format_In, UserListParams } from "../../interfaces/apiResponseTypes";
import SortCardsBy from "../Cards/SortCardsBy";
import { InitialConfig, SortableBy, ValidFormats } from "../../interfaces/initialConfigTypes";

export default function useUserList(
    lists: UserPreferences,
    {cards}: Pick<InitialConfig, 'cards'>,
    sort: SortableBy
) {
  const abortListRequest = useRef<null | AbortController>(null);
  const entries = Object.entries(lists) as [
    UserShowStatus,
    ShowListDetails<number>
  ][];

  const formats: { [k in ValidFormats]: Format_In } = {
      TV: ["TV", "TV_SHORT"],
      MOVIE: ["MOVIE", "SPECIAL"],
      OVA: ["ONA", "OVA"],
  };
  
  const test = entries.reduce((acc, [status, showInUserListDetails]) => {
        console.log(1, showInUserListDetails)
      const shows = Object.values(showInUserListDetails)
        console.log(2, shows)
      if(!shows.length) return acc

      const mainCards = shows.map((show) => {
        const {season, year, format} = show
        let formatKey: ValidFormats
        if(season && year) {
          const foundFormat = Object.entries(formats).find(([key,val]) => {
              return val.some(f_in => f_in === format) ? key : undefined;
          })

          if(foundFormat?.length) {
            formatKey = foundFormat[0] as ValidFormats
             //find out if shows is ongoing or of the curr season
            const match = cards?.[season]?.[year]?.[formatKey]?.find(
              (thisShow) => thisShow.id === show.id
            ) 
            const match2 = cards?.ONGOING?.[formatKey]?.find( 
              thisShow => thisShow.id === show.id
            )
            return match || match2 || []
          }
          return []
        }
        return []
      })
      return { ...acc, [status]: mainCards }
  }, {} as UserListParams)

    //test returns a UserListLike with maincards to be used in the
    //userList component 
    //todo implement this :w

    console.log(test)

  const [usableList, setUsableList] = useState(
    entries.reduce(
      (acc, [status]) => ({ ...acc, [status]: [] }),
      {} as UserListParams
    )
  );

    //cache the results
    //perhaps rethink the way network calls are being made here to limit the req
    //being sent to the API to prevent user rate limiting 
    //(maybe use placeholder data thats already available in lists 

  useEffect(() => {
        //we should check our userList object for each entries season and year
        //then we can probably find the entries that are already saved in context and reuse data
        //and then request the rest.
       
    // on page load and when user updates list entry, rebuild the cards and
    // make the necessarry network request.
    let numberOfShowsToRequest = 0;
    const ids = entries.reduce((acc, [userStatus, entries]) => {
      const showIds = Object.keys(entries);
      numberOfShowsToRequest += showIds.length;
      return { ...acc, [userStatus]: showIds };
    }, {} as { [x in UserShowStatus]: number[] });

    if(numberOfShowsToRequest > 100)
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

 return { usableList };
}
