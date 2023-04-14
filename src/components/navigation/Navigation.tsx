import React, { useEffect, useRef, useState, MutableRefObject } from "react";
import { SortableBy } from "../../interfaces/initialConfigTypes";
import {
  useDispatchContext,
  useStateContext,
} from "../../utilities/Context/AppContext";

import { hideNavOnClose } from "../../utilities/navigation/utilities";
import InputSearchAnime from "./InputSearchAnime";

const Navigation = ({
  // isVisible,
  darkMode,
}: {
  // isVisible: boolean;
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
  const searchInput: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const SortableBy: SortableBy[] = ["Rating", "Popularity", "Countdown"];

  function searchAutoFocus() {
    if (searchInput.current && isOpen.navigation) {
      searchInput.current.focus();
    }
  }

  useEffect(() => {
    if (isOpen.navigation === true && initialVisibility === "hidden") {
      setInitialVisibility("");
    }
  }, [isOpen.navigation]);

  function navItemLabel(text: string) {
    return <h3 className="dark:text-slate-300">{text}</h3>;
  }

  return (
    <nav
      className={`${initialVisibility} z-10 absolute flex flex-col h-screen p-4 bg-slate-500 dark:bg-zinc-800  ${
        isOpen.navigation && initialVisibility === ""
          ? "animate-slide-in-left"
          : "animate-slide-out-left"
      } `}
      onAnimationEnd={(e) => {
        hideNavOnClose(e);
        searchAutoFocus();
      }}
    >
      {navItemLabel("My Profile | Sign In")}
      <InputSearchAnime inputRef={searchInput} />
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
