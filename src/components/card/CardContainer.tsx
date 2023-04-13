import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import {
  checkIfCardsExist,
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
import ContainerPrefrences from "./ContainerPrefrences";

const CardContainer: FunctionComponent = () => {
  const { cards, client, variables, sort } = useStateContext();
  const dispatch = useDispatchContext();

  const { season, seasonYear, format } = variables;
  const isCallingAPI = useRef(false);
  const [clientVisibleCards, setClientVisibleCards] = useState<MainCard[]>([]);
  const [ammount, setAmmount] = useState(client.perPage);
  const abortRef = useRef<null | AbortController>(null);

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
    if (checkIfCardsExist(season, seasonYear, format, { cards })) {
      // IF cards are cached / re-use the  cached cards
      const sorted = SortCardsBy(sort, cards[season][seasonYear][format]);
      setClientVisibleCards(sorted.slice(0, ammount));
    } else {
      //create new AbortController to cancel consecutive requests if new request is made
      abortRef.current = new AbortController();
      // ****************** ANILIST API *********************
      // void requestAniListAPI(
      //   variables,
      //   dispatch,
      //   isCallingAPI,
      //   abortRef.current.signal
      // );
      // ****************** MOCK API ************************
      void requestMockAPI(
        variables,
        dispatch,
        isCallingAPI,
        abortRef.current.signal
      );

      setClientVisibleCards([]);
      setAmmount(15);
      return () => {
        if (abortRef.current) abortRef.current.abort();
      };
    }
  }, [cards, sort, ammount, season, format]);

  return (
    <>
      <ContainerPrefrences />
      {isCallingAPI.current == true ? (
        <div>calling api</div>
      ) : (
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
      )}
    </>
  );
};

export default CardContainer;
