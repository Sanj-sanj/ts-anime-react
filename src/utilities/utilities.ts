import React from "react";
import { APIVariables, MainCard } from "../interfaces/apiResponseTypes";
import { Actions, ClientVariables } from "../interfaces/initialConfigTypes";

// type CurrentTarget = EventTarget | HTMLOListElement;
// type Dispatch = React.Dispatch<Actions>;

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

function clientLoadNextPage(
  variables: { client: ClientVariables; api: APIVariables },
  ammount: number,
  updateDisplayNumber: React.Dispatch<React.SetStateAction<number>>,
  dispatch: React.Dispatch<Actions>
) {
  dispatch({
    type: "UPDATE_NEXT_PAGE_AVAILABLE",
    payload: {
      season: variables.api.season,
      year: variables.api.seasonYear,
      displayClientAmmount: ammount + variables.client.perPage,
    },
  });
  updateDisplayNumber(ammount + variables.client.perPage);
  // setIsFetching(true);
}

export function handleCardContainerScroll([
  currentTarget,
  variables,
  currentAmmount,
  updateDisplayNumber,
  dispatch,
]: [
  HTMLDivElement & EventTarget,
  { client: ClientVariables; api: APIVariables },
  number,
  React.Dispatch<React.SetStateAction<number>>,
  React.Dispatch<Actions>
]) {
  const { scrollTop, scrollHeight, clientHeight } = currentTarget;
  if (isBottomOfPage(scrollTop, clientHeight, scrollHeight)) {
    clientLoadNextPage(
      variables,
      currentAmmount,
      updateDisplayNumber,
      dispatch
    );
  }
}
export function handleCardContainerOnClick(
  variables: { client: ClientVariables; api: APIVariables },
  currentAmmount: number,
  updateDisplayNumber: React.Dispatch<React.SetStateAction<number>>,
  dispatch: React.Dispatch<Actions>
): void {
  clientLoadNextPage(variables, currentAmmount, updateDisplayNumber, dispatch);
}
