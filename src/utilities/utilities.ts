import React from "react";
import { APIVariables } from "../interfaces/apiRequestTypes";
import { Actions } from "../interfaces/initialConfigTypes";

type CurrentTarget = EventTarget & HTMLDivElement;
type Dispatch = React.Dispatch<Actions>;

export function throttle(callback: (...arg: any) => void, delay = 250) {
  const timer = [] as NodeJS.Timeout[];

  function throttledHandler(...args: [CurrentTarget, Dispatch, APIVariables]) {
    const id = setTimeout(() => callback(...args), delay);
    if (timer[0]) {
      const previousId = timer.shift() as NodeJS.Timeout;
      clearTimeout(previousId);
    }
    timer.push(id);
    return () => clearTimeout(id);
  }
  return throttledHandler;
}

export function isBottomOfPage(
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number
): boolean {
  return scrollTop + clientHeight === scrollHeight;
}

export function handleCardContainerScroll(
  currentTarget: EventTarget & HTMLDivElement,
  dispatch: React.Dispatch<Actions>,
  variables: APIVariables
) {
  const { scrollTop, scrollHeight, clientHeight } = currentTarget;
  if (isBottomOfPage(scrollTop, clientHeight, scrollHeight)) {
    const newVariables = { ...variables, page: variables.page + 1 };
    dispatch({ type: "UPDATE_VARIABLES", payload: newVariables });
    dispatch({ type: "UPDATE_IS_FETCHING", payload: true });
  }
}
