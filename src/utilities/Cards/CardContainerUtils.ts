import React from "react";
import { APIVariables, Season } from "../../interfaces/apiResponseTypes";
import {
  Actions,
  ClientVariables,
  InitialConfig,
  ValidFormats,
} from "../../interfaces/initialConfigTypes";

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
  { cards }: Pick<InitialConfig, "cards">
) {
  return cards[season]?.[year]?.[format] ? true : false;
}

function clientLoadNextPage(
  variables: { client: ClientVariables; api: APIVariables },
  ammount: number,
  updateDisplayNumber: React.Dispatch<React.SetStateAction<number>>,
  dispatch: React.Dispatch<Actions>
) {
  const { format, season, seasonYear } = variables.api;
  dispatch({
    type: "UPDATE_NEXT_PAGE_AVAILABLE",
    payload: {
      season: season,
      year: seasonYear,
      format: format,
      displayClientAmmount: ammount + variables.client.perPage,
    },
  });
  updateDisplayNumber(ammount + variables.client.perPage);
}

export function handleCardContainerScroll([
  currentTarget,
  variables,
  ammount,
  dispatch,
]: [
  HTMLDivElement & EventTarget,
  { client: ClientVariables; api: APIVariables },
  {
    currentAmmount: number;
    updateDisplayAmmount: React.Dispatch<React.SetStateAction<number>>;
  },
  React.Dispatch<Actions>
]) {
  const { scrollTop, scrollHeight, clientHeight } = currentTarget;
  if (isBottomOfPage(scrollTop, clientHeight, scrollHeight)) {
    clientLoadNextPage(
      variables,
      ammount.currentAmmount,
      ammount.updateDisplayAmmount,
      dispatch
    );
  }
}
export function handleCardContainerOnClick(
  variables: { client: ClientVariables; api: APIVariables },
  ammount: {
    currentAmmount: number;
    updateDisplayAmmount: React.Dispatch<React.SetStateAction<number>>;
  },
  dispatch: React.Dispatch<Actions>
): void {
  clientLoadNextPage(
    variables,
    ammount.currentAmmount,
    ammount.updateDisplayAmmount,
    dispatch
  );
}
