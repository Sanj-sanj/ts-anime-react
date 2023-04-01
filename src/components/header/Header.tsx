import { FunctionComponent } from "react";

const Header: FunctionComponent<{ toggleNavigation: () => void }> = ({
  toggleNavigation,
}) => {
  return (
    <header className="w-full bg-slate-800 px-10 flex justify-between items-center min-h-[10vh]">
      <h1 className="text-3xl text-slate-300">Seasonal Anime</h1>
      <button
        className="px-2 border border-gray-400"
        onClick={toggleNavigation}
      >
        Toggle Nav
      </button>
    </header>
  );
};
export default Header;
