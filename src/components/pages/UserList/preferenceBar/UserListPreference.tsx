import { Link } from "react-router-dom";
import CalendarSVG from "../../../../assets/calendar-svgrepo-com.svg";
import MedalSVG from "../../../../assets/medal.svg";
import CardSVG from "../../../../assets/card-svgrepo-com.svg";

const UserListPreferences = () => {
  return (
    <div className="w-full bg-slate-600 px-10 flex items-center min-h-[5vh] flex-row">
      <div className="w-full flex justify-center md:justify-end h-7">
        <Link
          to="/"
          className="px-3 text-lg focus:outline outline-2 rounded-sm outline-zinc-400"
          title="Card view"
        >
          <img src={CardSVG as string} className="w-6" alt="" />
        </Link>
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
  );
};

export default UserListPreferences;
