import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Season } from "../../../../interfaces/apiResponseTypes";
import {
  useDispatchContext,
  useStateContext,
} from "../../../../utilities/Context/AppContext";
import getCurrSeasonAndYear from "../../../../utilities/getCurrentSeasonAndYear";

import CalendarSVG from "../../../../assets/calendar-svgrepo-com.svg";
import MedalSVG from "../../../../assets/medal.svg";
import ResetSVG from "../../../../assets/reset-svgrepo-com.svg";
import changeFormat from "../../../../utilities/changeFormat";

export default function ContainerPreferences() {
  const { client, variables } = useStateContext();
  const currFormat = variables.format;
  const dispatch = useDispatchContext();
  const { season, seasonYear } = client;

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
      type: "UPDATE_CLIENT",
      payload: {
        ...client,
        season: seasons[currIndex],
        seasonYear: updatedYear,
      },
    });
    dispatch({
      type: "UPDATE_VARIABLES",
      payload: {
        ...variables,
        season: seasons[currIndex],
        seasonYear: updatedYear,
      },
    });
  }

  return (
    <div className="w-full bg-slate-600 px-10 flex items-center min-h-[5vh] flex-col lg:flex-row">
      <div className="pl-1 text-2xl w-72 whitespace-nowrap flex justify-between">
        <button
          className="px-2 focus:outline outline-2 rounded-sm outline-zinc-400"
          onClick={() => changeSeason("down")}
          title="Previous season"
        >
          {"<"}
        </button>
        <span className="w-40 text-center">
          {season} {seasonYear}
        </span>
        <button
          className="px-2 focus:outline outline-2 rounded-sm outline-zinc-400"
          onClick={() => changeSeason("up")}
          title="Next season"
        >
          {">"}
        </button>
      </div>

      <div className="w-auto flex flex-col lg:flex-row lg:w-full justify-center">
        <div className="pl-0 sm:pl-6 min-w-fit">
          <button
            className={`px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400 ${
              currFormat === "TV" ? "thick-underline underline-offset-8" : ""
            }`}
            value="TV"
            onClick={(e) => changeFormat(e, variables, dispatch)}
            title="Tv / Tv shorts"
          >
            TV
          </button>
          <button
            className={`px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400 ${
              currFormat === "MOVIE" ? "thick-underline underline-offset-8" : ""
            }`}
            value="MOVIE"
            onClick={(e) => changeFormat(e, variables, dispatch)}
            title="Movies"
          >
            MOVIE
          </button>
          <button
            className={`px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400 ${
              currFormat === "OVA" ? "thick-underline underline-offset-8" : ""
            }`}
            value="OVA"
            onClick={(e) => changeFormat(e, variables, dispatch)}
            title="OVA / ONA"
          >
            OVA
          </button>
        </div>
        <div className="w-full flex justify-center items-center lg:justify-end py-2 lg:py-0">
          <button
            className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
            title="Reset to nearest airing season"
            onClick={() => {
              const [currSeason, currYear] = getCurrSeasonAndYear();
              if (
                client.season !== currSeason ||
                client.seasonYear !== currYear
              ) {
                dispatch({
                  type: "UPDATE_VARIABLES",
                  payload: {
                    ...variables,
                    season: currSeason,
                    seasonYear: currYear,
                  },
                });
                dispatch({
                  type: "UPDATE_CLIENT",
                  payload: {
                    ...client,
                    season: currSeason,
                    seasonYear: currYear,
                  },
                });
              }
            }}
          >
            <img
              src={ResetSVG as string}
              alt="Reset to nearest airing season."
              className="w-6"
            />
          </button>
          <Link
            to="/calendar"
            className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
            title="Go to calendar view"
          >
            <img
              src={CalendarSVG as string}
              className="w-6"
              alt="Calendar view."
            />
          </Link>
          <Link
            to="/list"
            className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
            title="Go to my list"
          >
            <img src={MedalSVG as string} className="w-6" alt="My list" />
          </Link>
        </div>
      </div>
    </div>
  );
}
