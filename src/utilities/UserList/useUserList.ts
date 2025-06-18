import { useEffect, useRef, useState } from "react";
import requestUserListCards from "../API/requestUserListCards";
import { ShowListDetails, UserListDetails, UserListWithResults, UserPreferences, UserShowStatus } from "../../interfaces/UserPreferencesTypes";
import { Format_In } from "../../interfaces/apiResponseTypes";
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
  
  const listDetailsFromCards = entries.reduce((acc, [status, showInUserListDetails]) => {
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

  const [usableList, setUsableList] = useState(
    entries.reduce(
      (acc, [status]) => ({ ...acc, [status]: [] }),
      {} as UserListDetails
    )
  );
    
    function mergeLists() {
      const itterable = Object.entries(listDetailsFromCards)  
      return itterable.reduce((acc, [key, val]) => {
        const finalized = [...usableList[key as UserShowStatus], ...val]
        return { ...acc, [key]:finalized }
      },{} as UserListDetails)
    }

  useEffect(() => {
    let numberOfShowsToRequest = 0;
    const showIDsForRequest = entries.reduce((acc, [userStatus, entries]) => {
      const allIDs = Object.keys(entries);
      const requestIds = allIDs.reduce((acc,curr) => {
        return doNotRequestIDs[curr] ? acc : [...acc, curr]
      }, [] as string[])
      numberOfShowsToRequest += requestIds.length;
      return { ...acc, [userStatus]: requestIds };
    }, {} as { [x in UserShowStatus]: number[] });

    if(numberOfShowsToRequest > 0)
      void requestUserListCards(
        showIDsForRequest,
        lists,
        (newList: UserListDetails) =>
          setUsableList(SortCardsBy(sort, newList) as UserListDetails),
        abortListRequest.current?.signal
      );
    return () => {
      abortListRequest.current?.abort();
    };
  }, [lists, sort]);

    const finalizedList = mergeLists()
 return { usableList: finalizedList};
}
