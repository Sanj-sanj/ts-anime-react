import { useEffect, useRef, useState } from "react";
import requestUserListCards from "../API/requestUserListCards";
import { ShowListDetails, UserListDetails, UserListWithResults, UserPreferences, UserShowStatus } from "../../interfaces/UserPreferencesTypes";
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
  let doNotRequestIDs = {} as {[id in string]: boolean}
  const formats: { [k in ValidFormats]: Format_In } = {
      TV: ["TV", "TV_SHORT"],
      MOVIE: ["MOVIE", "SPECIAL"],
      OVA: ["ONA", "OVA"],
  };
  
  const test = entries.reduce((acc, [status, showInUserListDetails]) => {
      const shows = Object.values(showInUserListDetails)
      if(!shows.length) return { ...acc, [status]: [] }

      const reusableList = shows.reduce((acc, userShowDetails) => {
        const {season, year, format} = userShowDetails
        let formatKey: ValidFormats
        if(season && year) {
          const foundFormat = Object.entries(formats).find(([key,val]) => {
            return val.some(f_in => f_in === format) ? key : undefined;
          })
          if(foundFormat?.length) {
            formatKey = foundFormat[0] as ValidFormats
            const match = cards?.[season]?.[year]?.[formatKey]?.find(
              (thisShow) => thisShow.id === userShowDetails.id
            ) || cards?.ONGOING?.[formatKey]?.find( 
              thisShow => thisShow.id === userShowDetails.id
            )
            if(match && userShowDetails.id) {
              doNotRequestIDs = {...doNotRequestIDs, [userShowDetails.id]: true}
              return { 
                apiResults: match, 
                userListDetails: userShowDetails
              } 
            } 
          }
        }
        return acc
      }, {} as UserListWithResults ) 

      const previous = acc[status] || []
      return { ...acc, [status]: [...previous, reusableList] }
  }, {} as UserListDetails)
    console.log(test)

  const [usableList, setUsableList] = useState(
    entries.reduce(
      (acc, [status]) => ({ ...acc, [status]: [] }),
      {} as UserListParams
    )
  );
    
    function mergeLists() {
      const itter = Object.entries(test)  
      const foo = itter.reduce((acc, [key, val]) => {
        const repl = [...usableList[key as UserShowStatus], ...val]
        return {...acc, [key]:repl}
      },{} as UserListParams)
      return foo
    }

  useEffect(() => {
    //we should check our userList object for each entries season and year
    //then we can probably find the entries that are already saved in context 
    //and reuse data and then request the rest.
       
    // on page load and when user updates list entry, rebuild the cards and
    // make the necessarry network request.
    let numberOfShowsToRequest = 0;
    const showIDsForRequest = entries.reduce((acc, [userStatus, entries]) => {
      const showIds = Object.keys(entries);
      const requestIds = showIds.reduce((acc,curr) => {
        return doNotRequestIDs[curr] ? acc : [...acc, curr]
      }, [] as string[])
      numberOfShowsToRequest += requestIds.length;
      return { ...acc, [userStatus]: requestIds };
    }, {} as { [x in UserShowStatus]: number[] });

        console.log('shows for api req', showIDsForRequest)
    if(numberOfShowsToRequest > 0)
      void requestUserListCards(
        showIDsForRequest,
        lists,
        (newList: UserListParams) =>
          setUsableList(SortCardsBy(sort, newList) as UserListParams),
        abortListRequest.current?.signal
      );
    return () => {
      abortListRequest.current?.abort();
    };
  }, [lists, sort]);

    console.log('hi', usableList)
    console.log('final?', mergeLists())
    const a = mergeLists()
 return { usableList: a};
}
