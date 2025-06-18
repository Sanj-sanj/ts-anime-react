import React, { Dispatch, MutableRefObject, SetStateAction } from "react";
import { APIVariables, Season } from "../../interfaces/apiResponseTypes";
import {
  Actions,
  ClientVariables,
  InitialConfig,
  ValidFormats,
} from "../../interfaces/initialConfigTypes";
import getCurrSeasonAndYear from "../getCurrentSeasonAndYear";
import {
  requestAniListAPI,
  requestMockAPI,
} from "../API/requestCards_CardContainer";

export function throttle<fns>(callback: (params: fns) => void, delay = 250) {
  const timer: number[] = [];

  function throttledHandler(args: fns): void {
    const id = window.setTimeout(() => callback(args), delay);
    if (timer[0]) {
      const previousId = timer.shift();
      clearTimeout(previousId);
    }
    timer.push(id);
    () => clearTimeout(id);
  }
  return throttledHandler;
}

export const isBottomOfPage = (
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number
): boolean => scrollTop + clientHeight >= scrollHeight;

export function checkIfCardsExist(
  season: Season,
  year: number,
  format: ValidFormats,
  ongoing: boolean,
  { cards }: Pick<InitialConfig, "cards">
) {
  if (!ongoing) {
    return cards[season]?.[year]?.[format] ? true : false;
  } else {
    return cards.ONGOING[format].length && cards[season]?.[year]?.[format]
      ? true
      : false;
  }
}

function clientLoadNextPage(
  variables: { client: ClientVariables; api: APIVariables },
  ammount: number,
  updateDisplayNumber: React.Dispatch<React.SetStateAction<number>>
) {
  updateDisplayNumber(ammount + variables.client.perPage);
}

export function handleCardContainerScroll([currentTarget, variables, ammount]: [
  HTMLDivElement & EventTarget,
  { client: ClientVariables; api: APIVariables },
  {
    currentAmmount: number;
    updateDisplayAmmount: React.Dispatch<React.SetStateAction<number>>;
  }
]) {
  const { scrollTop, scrollHeight, clientHeight } = currentTarget;
  if (isBottomOfPage(scrollTop, clientHeight, scrollHeight)) {
    clientLoadNextPage(
      variables,
      ammount.currentAmmount,
      ammount.updateDisplayAmmount
    );
  }
}
export function handleCardContainerOnClick(
  variables: { client: ClientVariables; api: APIVariables },
  ammount: {
    currentAmmount: number;
    updateDisplayAmmount: React.Dispatch<React.SetStateAction<number>>;
  }
): void {
  clientLoadNextPage(
    variables,
    ammount.currentAmmount,
    ammount.updateDisplayAmmount
  );
}
export const callNextPageOnScroll = throttle<
  [
    HTMLDivElement & EventTarget,
    { client: ClientVariables; api: APIVariables },
    {
      currentAmmount: number;
      updateDisplayAmmount: React.Dispatch<React.SetStateAction<number>>;
    }
  ]
>(handleCardContainerScroll);

export const onPreferenceChange = (
  season: Season,
  seasonYear: number,
  dispatch: Dispatch<Actions>,
  containerRef: MutableRefObject<HTMLDivElement | null>,
  ongoingRef: MutableRefObject<"show" | "hide">,
  setAmmount: Dispatch<SetStateAction<number>>
) => {
  const [currSeason, currYear] = getCurrSeasonAndYear();
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
  containerRef.current?.scrollTo({ top: 0, behavior: "instant" });
  setAmmount(15);
};

export function requestNewCardsCardView(
  {
    abortOngoing,
    abortMainCard,
  }: {
    abortOngoing: MutableRefObject<AbortController | null>;
    abortMainCard: MutableRefObject<AbortController | null>;
  },
  {
    variables,
    dispatch,
    isCallingAPI,
    showOngoing,
  }: {
    variables: APIVariables;
    dispatch: Dispatch<Actions>;
    isCallingAPI: MutableRefObject<boolean>;
    showOngoing: boolean;
  },
  mockMode: boolean
) {
  //create new AbortController to cancel consecutive requests if new request is made
  abortOngoing.current = new AbortController();
  abortMainCard.current = new AbortController();
  // ****************** MOCK API ************************
  if (mockMode) {
    void requestMockAPI(
      variables,
      dispatch,
      isCallingAPI,
      showOngoing,
      abortMainCard.current.signal,
      abortOngoing.current.signal
    );
  } else {
    // ****************** ANILIST API *********************
    void requestAniListAPI(
      variables,
      dispatch,
      isCallingAPI,
      showOngoing,
      abortMainCard.current.signal,
      abortOngoing.current.signal
    );
  }
}
