import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import {
  callNextPageOnScroll,
  checkIfCardsExist,
  handleCardContainerOnClick,
} from "../../../../utilities/Cards/CardContainerUtils";
import Card from "../../../card/Card";
import {
  requestAniListAPI,
  requestMockAPI,
} from "../../../../utilities/API/requestCards_CardContainer";
import SortCardsBy from "../../../../utilities/Cards/SortCardsBy";
import { MainCard } from "../../../../interfaces/apiResponseTypes";
import {
  useDispatchContext,
  useStateContext,
} from "../../../../utilities/Context/AppContext";
import ContainerPreferences from "../preferenceBar/ContainerPreferences";

const CardContainer: FunctionComponent = () => {
  const { cards, client, variables, sort } = useStateContext();
  const { season, seasonYear, format } = variables;
  const dispatch = useDispatchContext();

  const [clientVisibleCards, setClientVisibleCards] = useState<MainCard[]>([]);
  const [ammount, setAmmount] = useState(client.perPage);
  const isCallingAPI = useRef(false);
  const abortMainCard = useRef<null | AbortController>(null);
  const containerRef = useRef<null | HTMLDivElement>(null);
  const lastFocusedCard = useRef<null | HTMLButtonElement>(null);

  useEffect(() => {
    if (
      lastFocusedCard.current !== null &&
      client.overlay.modal.active === false
    )
      lastFocusedCard.current.focus();
  }, [client.overlay.modal]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setAmmount(15);
  }, [season, format]);

  useEffect(() => {
    if (checkIfCardsExist(season, seasonYear, format, { cards })) {
      // IF cards are cached / re-use the  cached cards
      const sorted = SortCardsBy(
        sort,
        cards[season][seasonYear][format]
      ) as MainCard[];
      setClientVisibleCards(sorted.slice(0, ammount));
    } else {
      //create new AbortController to cancel consecutive requests if new request is made
      setClientVisibleCards([]);
      setAmmount(15);
      abortMainCard.current = new AbortController();
      // ****************** ANILIST API *********************
      // void requestAniListAPI(
      //   variables,
      //   dispatch,
      //   isCallingAPI,
      //   abortMainCard.current.signal
      // );
      // ****************** MOCK API ************************
      void requestMockAPI(
        variables,
        dispatch,
        isCallingAPI,
        abortMainCard.current.signal
      );
      return () => {
        if (abortMainCard.current) abortMainCard.current.abort();
      };
    }
  }, [cards, sort, ammount, season, seasonYear, format]);

  return (
    <>
      <ContainerPreferences />
      <div
        className="overflow-y-scroll w-screen p-2 flex flex-col items-center h-[85vh]"
        ref={containerRef}
        onScroll={(e) => {
          clientVisibleCards.length <
            cards?.[season]?.[seasonYear]?.[format]?.length &&
            callNextPageOnScroll([
              e.currentTarget,
              { client, api: { ...variables } },
              { currentAmmount: ammount, updateDisplayAmmount: setAmmount },
              dispatch,
            ]);
          lastFocusedCard.current !== null
            ? lastFocusedCard.current.focus()
            : null;
        }}
      >
        {isCallingAPI.current == true ? (
          <div>calling api</div>
        ) : (
          <>
            <ol className="flex flex-wrap whitespace-pre w-full flex-auto justify-center">
              {clientVisibleCards.length ? (
                clientVisibleCards.map((card) => (
                  <Card
                    key={card.id || card.title.romaji}
                    card={card}
                    focusRef={lastFocusedCard}
                  />
                ))
              ) : (
                <li>No results found.</li>
              )}
            </ol>
            <div className="flex flex-col border rounded border-gray-900 w-full mb-4 pt-2 pb-4 items-center">
              {clientVisibleCards.length <
              cards[season]?.[seasonYear]?.[format]?.length ? (
                <>
                  <p>You&apos;ve reached the bottom!</p>
                  <button
                    className="border-2 bg-slate-200 border-blue-800 p-2 w-fit"
                    onClick={() => {
                      handleCardContainerOnClick(
                        { client, api: { ...variables } },
                        {
                          currentAmmount: ammount,
                          updateDisplayAmmount: setAmmount,
                        },
                        dispatch
                      );
                      lastFocusedCard.current !== null
                        ? lastFocusedCard.current.focus()
                        : null;
                    }}
                  >
                    Click here for more results.
                  </button>
                </>
              ) : (
                <aside>You&apos;ve reached the end!</aside>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CardContainer;
