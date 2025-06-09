import { useEffect, useRef, useState } from "react";
import { checkIfCardsExist, onPreferenceChange, requestNewCardsCardView } from "../utilities/Cards/CardContainerUtils";
import { Actions } from "../interfaces/initialConfigTypes";
import { useStateContext } from "../utilities/Context/AppContext";

export default function useNewCards(dispatch: React.Dispatch<Actions>) {
    const { cards, client, variables } = useStateContext();
    const { season, seasonYear, showOngoing } = client;
    const { format } = variables

    //used to move the clients container's view to the top of the page
    const containerRef = useRef<null | HTMLDivElement>(null);

    const abortMainCard = useRef<null | AbortController>(null);
    const abortOngoing = useRef<null | AbortController>(null);

    const isMoreCards = useRef<boolean>(true);
    const isCallingAPI = useRef(false);

    //Ammount of cars to display on CardContainer at once
    const [ammount, setAmmount] = useState(client.perPage);
    const isMockOn = true;

    useEffect(() => {
        onPreferenceChange(
            season,
            seasonYear,
            dispatch,
            showOngoing,
            containerRef,
            setAmmount
        );
        if (
            !checkIfCardsExist(season, seasonYear, format, showOngoing, { cards })
        ) {
            isMoreCards.current = true;
            requestNewCardsCardView(
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
    return {cardView: {ammount, setAmmount,containerRef},  isCallingAPI, isMoreCards}
}
