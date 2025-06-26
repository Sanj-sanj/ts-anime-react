import { useEffect, useRef } from "react";
import { Actions, InitialConfig } from "../interfaces/initialConfigTypes";
import { useStateContext } from "../utilities/Context/AppContext";
import { checkIfCardsExist, handleCardAPICall } from "../utilities/Cards/CardContainerUtils";

export default function useNewCards(
    dispatch: React.Dispatch<Actions>,
    { cards }: Pick<InitialConfig, "cards">
) {
    const { client, variables } = useStateContext();
    const { season, seasonYear, showOngoing } = client;
    const { format } = variables

    const abortMainCard = useRef<null | AbortController>(null);
    const abortOngoing = useRef<null | AbortController>(null);

    const isCallingAPI = useRef(false);
    const isMockOn = true;

    useEffect(() => {
    if (
      !checkIfCardsExist(season, seasonYear, format, showOngoing, { cards })
    ) {
      console.log('cards dont exist', format)
      handleCardAPICall(
          { abortOngoing, abortMainCard },
          { variables, dispatch, isCallingAPI, showOngoing },
          isMockOn
      );
    }
        return () => {
            if (abortMainCard.current) abortMainCard.current.abort();
            if (abortOngoing.current) abortOngoing.current.abort();
        };
    }, [season, seasonYear, format, showOngoing]);
    return { isCallingAPI }
}
