import React, {
  ChangeEvent,
  FunctionComponent,
  useRef,
} from "react";
import {
  callNextPageOnScroll,
  checkIfCardsExist,
  handleCardContainerOnClick,
} from "../../../../utilities/Cards/CardContainerUtils";
import Card from "../../../card/Card";
import { MainCard } from "../../../../interfaces/apiResponseTypes";
import {
  useDispatchContext,
  useStateContext,
} from "../../../../utilities/Context/AppContext";
import ContainerPreferences from "../preferenceBar/ContainerPreferences";
import getCurrSeasonAndYear from "../../../../utilities/getCurrentSeasonAndYear";
import sortAndFilterCardsForView from "../../../../utilities/Cards/SortAndFilterCardsView";
import useNewCards from "../../../../hooks/useNewCards";
import ClientPreferenceSelections from "../../../clientPreferenceSelections/ClientPreferenceSlections";

const CardContainer: FunctionComponent = () => {
  const dispatch = useDispatchContext();
  const {cardView: { ammount, setAmmount, containerRef }, isCallingAPI, isMoreCards} = useNewCards(dispatch)
  const { cards, client, variables } = useStateContext();
  const { format } = variables;
  const { season, seasonYear, showOngoing, sort, titlesLang } = client;

  let clientVisibleCards: MainCard[] = [];
  const lastFocusedElement = useRef<null | HTMLButtonElement>(null);
  const [currSeason, currYear] = getCurrSeasonAndYear();
    
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
          {ClientPreferenceSelections(
            "Titles",
            "title-lang",
            ["English", "Romaji"],
            titlesLang,
            showOngoing,
            (e: ChangeEvent<HTMLSelectElement> | undefined) => {
              if (!e) return;
              const selection = e.target.value.toLowerCase() as
                | "english"
                | "romaji";
              dispatch({ type: "TOGGLE_LANGUAGE", payload: selection });
            }
          )}
          {ClientPreferenceSelections(
            "Ongoing",
            "set-ongoing",
            ["Show ongoing", "Hide ongoing"],
            titlesLang,
            showOngoing,
            (e: ChangeEvent<HTMLSelectElement> | undefined) => {
              if (!e) return;
              const selection = e.target.value.split(" ")[0].toLowerCase() as
                | "show"
                | "hide";
              //ongoingRef.current = selection;
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
