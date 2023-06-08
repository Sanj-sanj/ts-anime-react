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
import getCurrSeasonAndYear from "../../../../utilities/getCurrentSeasonAndYear";

const CardContainer: FunctionComponent = () => {
  const { cards, client, variables, sort } = useStateContext();
  const { format } = variables;
  const { season, seasonYear, showOngoing } = client;
  const dispatch = useDispatchContext();

  const [clientVisibleCards, setClientVisibleCards] = useState<MainCard[]>([]);
  const [ammount, setAmmount] = useState(client.perPage);
  const isCallingAPI = useRef(false);
  const abortMainCard = useRef<null | AbortController>(null);
  const abortOngoing = useRef<null | AbortController>(null);
  const containerRef = useRef<null | HTMLDivElement>(null);
  const lastFocusedCard = useRef<null | HTMLButtonElement>(null);
  const isMoreCards = useRef<boolean>(true);
  const ongoingRef = useRef<"hide" | "show">("show");
  const [currSeason, currYear] = getCurrSeasonAndYear();

  useEffect(() => {
    if (
      lastFocusedCard.current !== null &&
      client.overlay.modal.active === false
    )
      lastFocusedCard.current.focus();
  }, [client.overlay.modal]);

  useEffect(() => {
    if (season === currSeason && currYear === seasonYear) {
      dispatch({
        type: "TOGGLE_ONGOING",
        payload: {
          forceMode: ongoingRef.current === "show" ? true : false,
        },
      });
    } else {
      dispatch({
        type: "TOGGLE_ONGOING",
        payload: { forceMode: false },
      });
    }
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    isMoreCards.current = true;
    setAmmount(15);
  }, [season, seasonYear, format, showOngoing]);

  useEffect(() => {
    if (checkIfCardsExist(season, seasonYear, format, showOngoing, { cards })) {
      // IF cards are cached / re-use the  cached cards
      if (showOngoing) {
        const filteredAiringList = cards[season][seasonYear][format].filter(
          (sCard) =>
            !cards.ONGOING[format].find((oCard) => oCard.id === sCard.id)
        );
        const airingAndOngoing =
          cards.ONGOING[format]?.concat(filteredAiringList) || [];
        const sorted = SortCardsBy(sort, airingAndOngoing) as MainCard[];
        setClientVisibleCards(sorted.slice(0, ammount));
        if (ammount >= airingAndOngoing.length) isMoreCards.current = false;
      } else {
        const targ = cards[season][seasonYear][format];
        const sorted = SortCardsBy(sort, targ) as MainCard[];
        setClientVisibleCards(sorted.slice(0, ammount));
        if (ammount >= targ.length) isMoreCards.current = false;
      }
    } else {
      //create new AbortController to cancel consecutive requests if new request is made
      isMoreCards.current = true;
      abortOngoing.current = new AbortController();
      abortMainCard.current = new AbortController();
      // ****************** ANILIST API *********************
      void requestAniListAPI(
        variables,
        dispatch,
        isCallingAPI,
        showOngoing,
        abortMainCard.current.signal,
        abortOngoing.current.signal
      );
      // ****************** MOCK API ************************
      // void requestMockAPI(
      //   variables,
      //   dispatch,
      //   isCallingAPI,
      //   abortMainCard.current.signal
      // );
      return () => {
        if (abortMainCard.current) abortMainCard.current.abort();
        if (abortOngoing.current) abortOngoing.current.abort();
      };
    }
  }, [cards, sort, ammount, season, seasonYear, format, showOngoing]);

  function searchPrefSelects(
    labelTitle: string,
    couple: string,
    selectValues: string[],
    callback: () => void
  ) {
    return (
      <div className="flex border border-slate-300 dark:border-slate-400 mr-2">
        <label
          className="bg-slate-100 dark:bg-zinc-500 h-full border-r border-slate-300 dark:border-slate-400 p-2 w-24 text-center"
          htmlFor={couple}
        >
          {labelTitle}
        </label>
        <select
          name=""
          id={couple}
          className="w-32 pl-1 dark:bg-zinc-200"
          onChange={callback}
        >
          {selectValues.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <>
      <ContainerPreferences />
      <div
        className="overflow-y-scroll w-screen p-2 flex flex-col items-center h-[85vh]"
        ref={containerRef}
        onScroll={(e) => {
          isMoreCards.current &&
            callNextPageOnScroll([
              e.currentTarget,
              { client, api: { ...variables } },
              { currentAmmount: ammount, updateDisplayAmmount: setAmmount },
            ]);
          lastFocusedCard.current !== null
            ? lastFocusedCard.current.focus()
            : null;
        }}
      >
        <div className="blockman flex w-full p-2 justify-center">
          <div className="flex border border-slate-300 dark:border-slate-400 mr-2">
            <label
              className="bg-slate-100 dark:bg-zinc-500 h-full border-r border-slate-300 dark:border-slate-400 p-2 w-24 text-center"
              htmlFor="set-ongoing"
            >
              Ongoing
            </label>
            <select
              id="set-ongoing"
              className="w-32 pl-1 dark:bg-zinc-200"
              onChange={(e) => {
                const selection = e.target.value as "show" | "hide";
                ongoingRef.current = selection;
                if (
                  selection === "show" &&
                  currSeason === season &&
                  currYear === currYear
                ) {
                  dispatch({
                    type: "TOGGLE_ONGOING",
                    payload: { forceMode: true },
                  });
                } else {
                  dispatch({
                    type: "TOGGLE_ONGOING",
                    payload: { forceMode: false },
                  });
                }
              }}
            >
              <option value="show">Show ongoing</option>
              <option value="hide">Hide ongoing</option>
            </select>
          </div>
          {searchPrefSelects(
            "Titles",
            "title-lang",
            ["English", "Romaji"],
            () => {}
          )}
        </div>
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
              {isMoreCards.current ? (
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
                        }
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
