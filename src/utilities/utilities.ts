import React from "react";
import { APIVariables } from "../interfaces/apiResponseTypes";
import { Actions } from "../interfaces/initialConfigTypes";

type CurrentTarget = EventTarget | HTMLOListElement;
type Dispatch = React.Dispatch<Actions>;

export function throttle(callback: (...arg: any) => void, delay = 250) {
  const timer: number[] = [];

  function throttledHandler(
    ...args: [
      CurrentTarget,
      Dispatch,
      APIVariables,
      React.Dispatch<React.SetStateAction<boolean>>
    ]
  ) {
    const id = window.setTimeout(() => callback(...args), delay);
    if (timer[0]) {
      const previousId = timer.shift();
      clearTimeout(previousId);
    }
    timer.push(id);
    return () => clearTimeout(id);
  }
  return throttledHandler;
}

export const isBottomOfPage = (
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number
): boolean => scrollTop + clientHeight >= scrollHeight;

function nextAPIPage(
  variables: APIVariables,
  dispatch: React.Dispatch<Actions>,
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>
) {
  const newVariables: APIVariables = { ...variables, page: variables.page + 1 };
  dispatch({ type: "UPDATE_VARIABLES", payload: newVariables });
  setIsFetching(true);
}

export function handleCardContainerScroll(
  currentTarget: EventTarget & HTMLDivElement,
  dispatch: React.Dispatch<Actions>,
  variables: APIVariables,
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { scrollTop, scrollHeight, clientHeight } = currentTarget;
  if (isBottomOfPage(scrollTop, clientHeight, scrollHeight)) {
    nextAPIPage(variables, dispatch, setIsFetching);
  }
}
export function handleCardContainerOnClick(
  dispatch: React.Dispatch<Actions>,
  variables: APIVariables,
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>
): void {
  nextAPIPage(variables, dispatch, setIsFetching);
}
