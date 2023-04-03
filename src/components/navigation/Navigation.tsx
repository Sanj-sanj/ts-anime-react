import React, {
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  useReducer,
} from "react";
import { SortableBy } from "../../interfaces/initialConfigTypes";
import SortCardsBy from "../../utilities/Cards/Helper";
import { Initial } from "../../utilities/configVariables";
import { hideNavOnClose } from "../../utilities/navigation/utilities";
import appReducer from "../../utilities/topReducer";
import InputSearchAnime from "./InputSearchAnime";

const Navigation = ({
  isOpen,
  darkMode,
}: {
  isOpen: boolean;
  darkMode: { isDarkMode: boolean; toggleDarkMode: () => void };
}) => {
  /* 
  We set the component to initially hold the tailwindCSS class 'hidden' to hide the navbar on initial page builds. 
  We then use a 'useEffect' which conditionally proceeds on the basis that the navbar is being opened for the first time. 
  Finally we swap the initial state of 'hidden' to an empty string to resume normal component functionality.
  */
  const [{ cards, variables, sort }, dispatch] = useReducer(
    appReducer,
    Initial
  );
  const { isDarkMode, toggleDarkMode } = darkMode;
  const [initialVisibility, setInitialVisibility] = useState("hidden");
  const searchInput: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const SortableBy: SortableBy[] = ["Rating", "Popularity", "Countdown"];

  function searchAutoFocus() {
    if (searchInput.current && isOpen) {
      searchInput.current.focus();
    }
  }

  useEffect(() => {
    if (isOpen === true && initialVisibility === "hidden") {
      setInitialVisibility("");
    }
  }, [isOpen]);

  function navItemLabel(text: string) {
    return <h3 className="dark:text-slate-300">{text}</h3>;
  }

  return (
    <nav
      className={`${initialVisibility} z-10 absolute flex flex-col h-screen p-4 bg-slate-500 dark:bg-zinc-800  ${
        isOpen && initialVisibility === ""
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
                sortfn: SortCardsBy,
                season: variables.season,
                year: variables.seasonYear,
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
SortCardsBy;

export default Navigation;
