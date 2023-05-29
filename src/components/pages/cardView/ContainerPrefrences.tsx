import { MouseEvent, useRef } from "react";
import { Link } from "react-router-dom";
import { Formats, Season } from "../../../interfaces/apiResponseTypes";
import { ValidFormats } from "../../../interfaces/initialConfigTypes";
import {
  useDispatchContext,
  useStateContext,
} from "../../../utilities/Context/AppContext";
import getCurrSeasonAndYear from "../../../utilities/getCurrentSeasonAndYear";

import CalendarSVG from "../../../assets/calendar-svgrepo-com.svg";
import MedalSVG from "../../../assets/medal.svg";

export default function ContainerPrefrences() {
  const { variables } = useStateContext();
  const dispatch = useDispatchContext();
  const { season, seasonYear } = variables;
  const currentlyActiveFormat = useRef<HTMLButtonElement | null>(null);

  function changeSeason(change: "up" | "down") {
    const seasons: Season[] = ["WINTER", "SPRING", "SUMMER", "FALL"];
    let currIndex = seasons.findIndex((v) => v === season);
    let updatedYear = seasonYear;
    if (change === "up") {
      currIndex++;
    } else {
      currIndex--;
    }
    if (currIndex === 4) {
      currIndex = 0;
      updatedYear++;
    } else if (currIndex === -1) {
      currIndex = 3;
      updatedYear--;
    }
    dispatch({
      type: "UPDATE_VARIABLES",
      payload: {
        ...variables,
        season: seasons[currIndex],
        seasonYear: updatedYear,
      },
    });
  }

  function isValidFormat(format: string): format is ValidFormats {
    return ["TV", "MOVIE", "OVA"].includes(format);
  }
  function changeFormat(e: MouseEvent) {
    const target = e.currentTarget as HTMLButtonElement;
    const whichFormat = target.value;
    if (!isValidFormat(whichFormat)) return;
    currentlyActiveFormat.current?.classList.remove(
      "thick-underline",
      "underline-offset-8"
    );
    target.classList.add("thick-underline", "underline-offset-8");
    currentlyActiveFormat.current = target;

    const formats: { [k in ValidFormats]: Formats } = {
      TV: ["TV", "TV_SHORT"],
      MOVIE: ["MOVIE", "SPECIAL"],
      OVA: ["ONA", "OVA"],
    };
    dispatch({
      type: "UPDATE_VARIABLES",
      payload: {
        ...variables,
        format_in: formats[whichFormat],
        format: whichFormat,
      },
    });
  }

  return (
    <div className="w-full bg-slate-600 px-10 flex items-center min-h-[5vh] flex-col lg:flex-row">
      <div className="pl-1 text-2xl w-60 whitespace-nowrap flex justify-between">
        <button
          className="px-2 focus:outline outline-2 rounded-sm outline-zinc-400 mr-1"
          onClick={() => changeSeason("down")}
          title="Previous season"
        >
          {"<"}
        </button>
        {season} {seasonYear}
        <button
          className="px-2 focus:outline outline-2 rounded-sm outline-zinc-400 ml-1"
          onClick={() => changeSeason("up")}
          title="Next season"
        >
          {">"}
        </button>
      </div>

      <div>
        <div className="pl-0 sm:pl-6 min-w-fit">
          <button
            className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400 thick-underline underline-offset-8"
            value="TV"
            onClick={(e) => changeFormat(e)}
            title="Tv / Tv shorts"
            ref={currentlyActiveFormat}
          >
            TV
          </button>
          <button
            className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
            value="MOVIE"
            onClick={(e) => changeFormat(e)}
            title="Movies"
          >
            MOVIE
          </button>
          <button
            className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
            value="OVA"
            onClick={(e) => changeFormat(e)}
            title="OVA / ONA"
          >
            OVA
          </button>
        </div>
        <div className="w-full flex justify-center lg:justify-end">
          <button
            className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
            title="Nearest Season"
            onClick={() => {
              const [currSeason, currYear] = getCurrSeasonAndYear();
              if (
                variables.season !== currSeason ||
                variables.seasonYear !== currYear
              ) {
                dispatch({
                  type: "UPDATE_VARIABLES",
                  payload: {
                    ...variables,
                    season: currSeason,
                    seasonYear: currYear,
                  },
                });
              }
            }}
          >
            Current Season
          </button>
          <button
            className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
            title="Calendar view"
          >
            <img src={CalendarSVG as string} className="w-6" alt="" />
          </button>
          <Link
            to="/list"
            className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
            title="My list"
          >
            <img src={MedalSVG as string} className="w-6" alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
}
