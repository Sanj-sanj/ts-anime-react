import React, { useEffect, useRef, useState } from "react";
import { SortableBy } from "../../interfaces/initialConfigTypes";
import {
  useDispatchContext,
  useStateContext,
} from "../../utilities/Context/AppContext";
import useFocusEffect from "../../utilities/Focus/FocusUtil";
import InputSearchAnime from "./InputSearchAnime";

const Navigation = ({
  darkMode,
}: {
  darkMode: { isDarkMode: boolean; toggleDarkMode: () => void };
}) => {
  /* 
  We set the component to initially hold the tailwindCSS class 'hidden' to hide the navbar on initial page builds. 
  We then use a 'useEffect' which conditionally proceeds on the basis that the navbar is being opened for the first time. 
  Finally we swap the initial state of 'hidden' to an empty string to resume normal component functionality.
  */

  const {
    sort,
    client: { isOpen },
  } = useStateContext();
  const dispatch = useDispatchContext();

  const { isDarkMode, toggleDarkMode } = darkMode;
  const [initialVisibility, setInitialVisibility] = useState("hidden");
  const navigationRef = useRef<HTMLElement | null>(null);
  const SortableBy: SortableBy[] = ["Rating", "Popularity", "Countdown"];

  const closeNavigation = () => {
    dispatch({ type: "TOGGLE_NAVIGATION", action: "CLOSE" });
  };
  function navItemLabel(text: string) {
    return <h3 className="dark:text-slate-300">{text}</h3>;
  }

  useEffect(() => {
    if (isOpen.navigation === true && initialVisibility === "hidden") {
      setInitialVisibility("");
    }
  }, [isOpen.navigation]);

  useFocusEffect(navigationRef.current, closeNavigation);

  return (
    <nav
      className={`${initialVisibility} z-30 absolute flex flex-col h-screen p-4 bg-slate-500 dark:bg-slate-900  ${
        isOpen.navigation && initialVisibility === ""
          ? "animate-slide-in-left"
          : "animate-slide-out-left"
      } `}
      onAnimationEnd={() => {
        if (navigationRef.current?.classList.contains("animate-slide-out-left"))
          navigationRef.current.classList.add("hidden");
      }}
      ref={navigationRef}
    >
      {navItemLabel("My Profile | Sign In")}
      <InputSearchAnime />
      {navItemLabel("My List")}
      <button
        className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 active:bg-slate-500 focus:outline focus:outline-zinc-700 dark:text-slate-300"
        onClick={() => {
          //update layout state
          toggleDarkMode();
        }}
      >
        <h3>{isDarkMode ? "Light" : "Dark"} Mode</h3>
      </button>

      {navItemLabel("Sort By:")}
      <label htmlFor="sort_cards_by" defaultValue={sort}>
        <select
          name="sort_cards_by"
          id="sort_cards_by"
          className="w-full"
          onChange={(e) =>
            dispatch({
              type: "UPDATE_SORT",
              payload: {
                sort: e.target.value as SortableBy,
              },
            })
          }
        >
          {SortableBy.map((sort) => (
            <option key={sort} value={sort}>
              {sort}
            </option>
          ))}
        </select>
      </label>
    </nav>
  );
};

export default Navigation;
