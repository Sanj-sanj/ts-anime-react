import React, { FunctionComponent, useEffect, useState } from "react";
import {
  handleCardContainerOnClick,
  handleCardContainerScroll,
  throttle,
} from "../../utilities/Cards/CardContainerUtils";
import Card from "./Card";
import { Actions, ClientVariables } from "../../interfaces/initialConfigTypes";
import {
  requestAniListAPI,
  requestMockAPI,
} from "../../utilities/API/requestCards_CardContainer";
import SortCardsBy from "../../utilities/Cards/SortCardsBy";
import { APIVariables, MainCard } from "../../interfaces/apiResponseTypes";
import {
  useDispatchContext,
  useStateContext,
} from "../../utilities/Context/AppContext";

const CardContainer: FunctionComponent = () => {
  const { cards, client, variables, sort } = useStateContext();
  const dispatch = useDispatchContext();

  const { season, seasonYear } = variables;

  const [isCallingAPI, setIsCallingAPI] = useState(true);
  const [clientVisibleCards, setClientVisibleCards] = useState<MainCard[]>([]);
  const [ammount, setAmmount] = useState(client.perPage);

  const callNextPageOnScroll = throttle<
    [
      HTMLDivElement & EventTarget,
      { client: ClientVariables; api: APIVariables },
      {
        currentAmmount: number;
        updateDisplayAmmount: React.Dispatch<React.SetStateAction<number>>;
      },
      React.Dispatch<Actions>
    ]
  >(handleCardContainerScroll);

  useEffect(() => {
    if (cards[season] && cards[season][seasonYear]) {
      const sorted = SortCardsBy(sort, cards[season][seasonYear]);
      setClientVisibleCards(sorted.slice(0, ammount));
    }
  }, [cards, sort, ammount]);

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
          { currentAmmount: ammount, updateDisplayAmmount: setAmmount },
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
              {
                currentAmmount: ammount,
                updateDisplayAmmount: setAmmount,
              },
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
