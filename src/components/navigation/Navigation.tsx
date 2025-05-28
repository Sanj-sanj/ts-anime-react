import React, { useRef } from "react";
import { SortableBy } from "../../interfaces/initialConfigTypes";
import requestNewEpisodesCheck from "../../utilities/API/requestNewEpisodesCheck";
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
  const {
    client: { overlay, sort },
    user: { lists },
    cards 
  } = useStateContext();
  const dispatch = useDispatchContext();
  const SortableBy: SortableBy[] = ["Rating", "Popularity", "Countdown"];
  const abortNewEpisode = useRef<null | AbortController>();
  const { isDarkMode, toggleDarkMode } = darkMode;
  const navigationRef = useRef<HTMLElement | null>(null);

  const closeNavigation = () => {
    dispatch({ type: "TOGGLE_NAVIGATION", payload: "CLOSE" });
  };
  function navItemLabel(text: string) {
    return <h3 className="dark:text-slate-300">{text}</h3>;
  }

  if (overlay.navigation.active === true) {
    navigationRef.current?.classList.replace("hidden", "flex");
    navigationRef.current?.classList.replace(
      "animate-slide-out-left",
      "animate-slide-in-left"
    );
  } else {
    navigationRef.current?.classList.replace(
      "animate-slide-in-left",
      "animate-slide-out-left"
    );
  }

  useFocusEffect(navigationRef.current, closeNavigation);

  return (
    <nav
      hidden={!overlay.navigation.active}
      className="hidden z-30 absolute flex-col h-screen p-4 bg-slate-500 dark:bg-slate-900 animate-slide-in-left"
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

      <button
        className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 active:bg-slate-500 focus:outline focus:outline-zinc-700 dark:text-slate-300"
        onClick={() => {
          //update layout state
            console.log(JSON.stringify(cards))
        }}
      >
        <h3>somethign</h3>
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
      {navItemLabel("new releases:")}
      <button
        className="bg-slate-300 dark:bg-slate-700"
        onClick={() => {
          closeNavigation();
          void requestNewEpisodesCheck(
            Object.keys(lists.WATCHING)
              .concat(Object.keys(lists.INTERESTED))
              .map((n) => +n),
            lists,
            dispatch,
            abortNewEpisode.current?.signal
          );
        }}
      >
        click
      </button>
    </nav>
  );
};

export default Navigation;
