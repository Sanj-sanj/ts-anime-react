import React, {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from "react";
import { Initial } from "../../utilities/configVariables";
import appReducer from "../../utilities/topReducer";
import {
  handleCardContainerOnClick,
  handleCardContainerScroll,
  throttle,
} from "../../utilities/utilities";
import Card from "./Card";
import { Actions, ClientVariables } from "../../interfaces/initialConfigTypes";
import {
  requestAniListAPI,
  requestMockAPI,
} from "../../utilities/API/requestCards_CardContainer";
import SortCardsBy from "../../utilities/Cards/Helper";
import { APIVariables, MainCard } from "../../interfaces/apiResponseTypes";

const CardContainer: FunctionComponent = () => {
  const [{ variables, cards, sort, client }, dispatch] = useReducer(
    appReducer,
    Initial
  );
  const { season, seasonYear } = variables;

  const [isCallingAPI, setIsCallingAPI] = useState(true);
  const [clientVisibleCards, setClientVisibleCards] = useState<MainCard[]>([]);
  const [ammount, setAmmount] = useState(client.perPage);

  const callNextPageOnScroll = throttle<
    [
      HTMLDivElement & EventTarget,
      { client: ClientVariables; api: APIVariables },
      number,
      React.Dispatch<React.SetStateAction<number>>,
      React.Dispatch<Actions>
    ]
  >(handleCardContainerScroll);

  useLayoutEffect(() => {
    if (cards[season] && cards[season][seasonYear]) {
      setClientVisibleCards(cards[season][seasonYear].slice(0, ammount));
      // setClientVisibleCards(
      //   SortCardsBy(sort, cards[season][seasonYear]).slice(0, ammount)
      // );
    }
  }, [cards, ammount]);

  useEffect(() => {
    if (isCallingAPI) {
      // void requestAniListAPI(variables, dispatch);
      void requestMockAPI(variables, dispatch);
      setIsCallingAPI(false);
    }
  }, [isCallingAPI]);
  return (
    <div
      className="overflow-y-scroll w-screen flex flex-col items-center h-[90vh]"
      onScroll={(e) =>
        client.nextPageAvailable &&
        callNextPageOnScroll([
          e.currentTarget,
          { client, api: variables },
          ammount,
          setAmmount,
          dispatch,
        ])
      }
    >
      <ol className="flex flex-wrap whitespace-pre p-2 w-full flex-auto justify-center">
        {clientVisibleCards.length ? (
          clientVisibleCards.map((card) => (
            <Card key={card.id || card.title.romaji} card={card} />
          ))
        ) : (
          <li>No results found.</li>
        )}
      </ol>
      {client.nextPageAvailable ? (
        <button
          className="border-2 bg-slate-200 border-blue-800 p-2"
          onClick={() =>
            handleCardContainerOnClick(
              { client, api: variables },
              ammount,
              setAmmount,
              dispatch
            )
          }
        >
          Click here if more results do not load.
        </button>
      ) : (
        <aside>You&apos;ve reached the end!</aside>
      )}
    </div>
  );
};

export default CardContainer;
