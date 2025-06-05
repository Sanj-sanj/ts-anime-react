import { Link } from "react-router-dom";
import { useDispatchContext, useStateContext } from "../../../../utilities/Context/AppContext"
import CalendarSVG from "../../../../assets/calendar-svgrepo-com.svg"
import MedalSVG from "../../../../assets/medal.svg";
import CardSVG from "../../../../assets/card-svgrepo-com.svg";
import changeFormat from "../../../../utilities/changeFormat";

const UserListPreferences = () => {
    const { variables } = useStateContext()
    const dispatch = useDispatchContext()
  return (
    <div className="w-full bg-slate-600 px-10 flex items-center min-h-[5vh] flex-row">
        <div className="pl-0 sm:pl-6 min-w-fit">
          <button
            className={`px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400 ${
              variables.format === "TV" ? "thick-underline underline-offset-8" : ""
            }`}
            value="TV"
            onClick={(e) => changeFormat(e, variables, dispatch)}
            title="Tv / Tv shorts"
          >
            TV
          </button>
          <button
            className={`px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400 ${
              variables.format === "MOVIE" ? "thick-underline underline-offset-8" : ""
            }`}
            value="MOVIE"
            onClick={(e) => changeFormat(e, variables, dispatch)}
            title="Movies"
          >
            MOVIE
          </button>
          <button
            className={`px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400 ${
              variables.format === "OVA" ? "thick-underline underline-offset-8" : ""
            }`}
            value="OVA"
            onClick={(e) => changeFormat(e, variables, dispatch)}
            title="OVA / ONA"
          >
            OVA
          </button>
        </div>
      <div className="w-full flex justify-center items-center md:justify-end h-7">
        <Link
          to="/"
          className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
          title="Card view"
        >
          <img src={CardSVG as string} className="w-6" alt="" />
        </Link>
        <Link
          to="/calendar"
          className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
          title="Calendar view"
        >
          <img src={CalendarSVG as string} className="w-6" alt="" />
        </Link>
        <Link
          to="/list"
          className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
          title="My list"
        >
          <img src={MedalSVG as string} className="w-6" alt="" />
        </Link>
      </div>
    </div>
  );
};

export default UserListPreferences;
