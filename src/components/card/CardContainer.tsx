import React, { FunctionComponent, useEffect, useState } from "react";
import {
  handleCardContainerOnClick,
  handleCardContainerScroll,
  throttle,
} from "../../utilities/Cards/CardContainerUtils";
import Card from "./Card";
import {
  Actions,
  ClientVariables,
  ValidFormats,
} from "../../interfaces/initialConfigTypes";
import {
  requestAniListAPI,
  requestMockAPI,
} from "../../utilities/API/requestCards_CardContainer";
import SortCardsBy from "../../utilities/Cards/SortCardsBy";
import {
  APIVariables,
  MainCard,
  Season,
} from "../../interfaces/apiResponseTypes";
import {
  useDispatchContext,
  useStateContext,
} from "../../utilities/Context/AppContext";
import ContainerPrefrences from "./ContainerPrefrences";

const CardContainer: FunctionComponent = () => {
  const { cards, client, variables, sort } = useStateContext();
  const dispatch = useDispatchContext();

  const { season, seasonYear, format } = variables;

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

  function checkIfCardsExist(
    season: Season,
    year: number,
    format: ValidFormats
  ) {
    return cards[season]?.[year]?.[format]?.length ? true : false;
  }

  useEffect(() => {
    if (cards[season]?.[seasonYear]?.[format]) {
      const sorted = SortCardsBy(sort, cards[season][seasonYear][format]);
      setClientVisibleCards(sorted.slice(0, ammount));
    } else {
      setIsCallingAPI(true);
      setAmmount(15);
    }
  }, [cards, sort, ammount, season, format]);

  useEffect(() => {
    if (isCallingAPI) {
      if (!checkIfCardsExist(season, seasonYear, format)) {
        void requestAniListAPI(variables, dispatch);
        // void requestMockAPI(variables, dispatch);
      }
      setClientVisibleCards([]);
      setIsCallingAPI(false);
    }
  }, [isCallingAPI]);

  return (
    <>
      <ContainerPrefrences />
      <div
        className="overflow-y-scroll w-screen flex flex-col items-center h-[85vh]"
        onScroll={(e) =>
          clientVisibleCards.length <
            cards?.[season]?.[seasonYear]?.[format]?.length &&
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
        {clientVisibleCards.length <
        cards[season]?.[seasonYear]?.[format]?.length ? (
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
    </>
  );
};

export default CardContainer;
