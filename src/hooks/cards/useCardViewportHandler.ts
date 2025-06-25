import { Dispatch, useEffect, useRef, useState } from "react";
import { Actions, ClientVariables } from "../../interfaces/initialConfigTypes";
import { onSeasonChange } from "../../utilities/Cards/CardContainerUtils";

export default function useCardViewportHanlder (
    client: ClientVariables,
    dispatch: Dispatch<Actions>,
) {
  const [ammount, setAmmount] = useState(client.perPage);
  const ongoingRef = useRef<'show'|'hide'>('show')
  const containerRef = useRef<null | HTMLDivElement>(null);
  const isMoreCards = useRef<boolean>(true);
  const { season, seasonYear, showOngoing} = client;

  useEffect(() => {
    if(ongoingRef && containerRef) {
      onSeasonChange(
        season,
        seasonYear,
        dispatch,
        containerRef,
        ongoingRef,
        setAmmount
      );
    }
  }, [season, seasonYear, showOngoing])

  return { isMoreCards, ongoingRef, containerRef, cardView: {ammount, setAmmount}  }
}
