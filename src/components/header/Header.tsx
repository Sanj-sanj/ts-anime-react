import { FunctionComponent } from "react";

const Header: FunctionComponent<{ toggleNavigation: () => void }> = ({
  toggleNavigation,
}) => {
  return (
    <header
      className="w-full bg-slate-800 px-10 text-lg flex justify-between"
      style={{ minHeight: "10vh" }}
    >
      <h1>lol lol lool</h1>
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
