import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  callNextPageOnScroll,
  checkIfCardsExist,
  handleCardContainerOnClick,
  onPreferenceChange,
  requestNewCardsCardView,
  sortAndFilterCardsForView,
} from "../../../../utilities/Cards/CardContainerUtils";
import Card from "../../../card/Card";
import { MainCard } from "../../../../interfaces/apiResponseTypes";
import {
  useDispatchContext,
  useStateContext,
} from "../../../../utilities/Context/AppContext";
import ContainerPreferences from "../preferenceBar/ContainerPreferences";
import getCurrSeasonAndYear from "../../../../utilities/getCurrentSeasonAndYear";

const CardContainer: FunctionComponent = () => {
  const { cards, client, variables } = useStateContext();
  const { format } = variables;
  const { season, seasonYear, showOngoing, sort, titlesLang } = client;
  const dispatch = useDispatchContext();

  let clientVisibleCards: MainCard[] = [];
  const isMockOn = false;

  const [ammount, setAmmount] = useState(client.perPage);
  const isCallingAPI = useRef(false);
  const abortMainCard = useRef<null | AbortController>(null);
  const abortOngoing = useRef<null | AbortController>(null);
  const containerRef = useRef<null | HTMLDivElement>(null);
  const lastFocusedElement = useRef<null | HTMLButtonElement>(null);
  const isMoreCards = useRef<boolean>(true);
  const ongoingRef = useRef<"hide" | "show">(showOngoing ? "show" : "hide");
  const [currSeason, currYear] = getCurrSeasonAndYear();

  function searchPrefSelects(
    labelTitle: string,
    couple: string,
    selectValues: string[],
    callback: (e?: ChangeEvent<HTMLSelectElement>) => void
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
          defaultValue={
            couple === "title-lang"
              ? `${titlesLang
                  .slice(0, 1)
                  .toUpperCase()
                  .concat(titlesLang.slice(1))}`
              : showOngoing
              ? "Show ongoing"
              : "Hide ongoing"
          }
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
  if (
    lastFocusedElement.current !== null &&
    client.overlay.modal.active === false
  )
    lastFocusedElement.current.focus();

  // if the ammount of cards shown is less than available to see, isMore = true : isMore = false
  if (showOngoing) {
    if (ammount >= cards.ONGOING[format].length) {
      isMoreCards.current = false;
    } else isMoreCards.current = true;
  } else {
    if (ammount >= cards[season]?.[seasonYear]?.[format]?.length) {
      isMoreCards.current = false;
    } else isMoreCards.current = true;
  }

  if (checkIfCardsExist(season, seasonYear, format, showOngoing, { cards }))
    clientVisibleCards = sortAndFilterCardsForView(
      sort,
      ammount,
      { cards },
      { season, format, seasonYear },
      showOngoing
    );

  useEffect(() => {
    onPreferenceChange(
      season,
      seasonYear,
      dispatch,
      ongoingRef,
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
          lastFocusedElement.current !== null
            ? lastFocusedElement.current.focus()
            : null;
        }}
      >
        <div className="flex w-full p-2 justify-center">
          {searchPrefSelects(
            "Titles",
            "title-lang",
            ["English", "Romaji"],
            (e: ChangeEvent<HTMLSelectElement> | undefined) => {
              if (!e) return;
              const selection = e.target.value.toLowerCase() as
                | "english"
                | "romaji";
              dispatch({ type: "TOGGLE_LANGUAGE", payload: selection });
            }
          )}
          {searchPrefSelects(
            "Ongoing",
            "set-ongoing",
            ["Show ongoing", "Hide ongoing"],
            (e: ChangeEvent<HTMLSelectElement> | undefined) => {
              console.log("somehow?");
              if (!e) return;
              const selection = e.target.value.split(" ")[0].toLowerCase() as
                | "show"
                | "hide";
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
            }
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
                    titlePref={client.titlesLang}
                    focusRef={lastFocusedElement}
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
                      lastFocusedElement.current !== null
                        ? lastFocusedElement.current.focus()
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
