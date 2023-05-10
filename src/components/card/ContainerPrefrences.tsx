import { MouseEvent, useRef } from "react";
import { Formats, Season } from "../../interfaces/apiResponseTypes";
import { ValidFormats } from "../../interfaces/initialConfigTypes";
import {
  useDispatchContext,
  useStateContext,
} from "../../utilities/Context/AppContext";

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
    <div className="w-full bg-slate-600 px-10 flex items-center min-h-[5vh] flex-col sm:flex-row">
      <div className="pl-1 text-2xl w-60 whitespace-nowrap flex justify-between">
        <button
          className="px-2 focus:outline outline-2 rounded-sm outline-zinc-400 mr-1"
          onClick={() => changeSeason("down")}
        >
          {"<"}
        </button>
        {season} {seasonYear}
        <button
          className="px-2 focus:outline outline-2 rounded-sm outline-zinc-400 ml-1"
          onClick={() => changeSeason("up")}
        >
          {">"}
        </button>
      </div>

      <div className="pl-0 sm:pl-6">
        <button
          className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400 thick-underline underline-offset-8"
          value="TV"
          onClick={(e) => changeFormat(e)}
          ref={currentlyActiveFormat}
        >
          TV
        </button>
        <button
          className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
          value="MOVIE"
          onClick={(e) => changeFormat(e)}
        >
          MOVIE
        </button>
        <button
          className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
          value="OVA"
          onClick={(e) => changeFormat(e)}
        >
          OVA
        </button>
      </div>
    </div>
  );
}
