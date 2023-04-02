import Navigation from "../navigation/Navigation";
import Header from "../header/Header";
import React, { useEffect, useReducer, useState } from "react";
import { setupDarkMode } from "../../utilities/layout/utilities";
import appReducer from "../../utilities/topReducer";
import { Initial } from "../../utilities/configVariables";

type Props = {
  children: JSX.Element;
};

const Layout = ({ children }: Props) => {
  const [isOpen, setisOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(setupDarkMode());
  const toggleNavigation = () => setisOpen(!isOpen);

  const [{ cards, nextPageAvailable, variables }, dispatch] = useReducer(
    appReducer,
    Initial
  );

  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
  }

  useEffect(() => {
    if (isDarkMode) {
      document.querySelector("html")?.classList.add("dark");
      localStorage.setItem("dark", "true");
    } else {
      document.querySelector("html")?.classList.remove("dark");
      localStorage.setItem("dark", "false");
    }
  }, [isDarkMode]);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      console.log("valids");

      return React.cloneElement(
        child,
        [{ variables, cards, nextPageAvailable }],
        <div>superdoo</div>
      );
    }
    return child;
  });

  console.log(childrenWithProps);

  return (
    <>
      {/* Navigation panel hidden on the left */}
      <Navigation isOpen={isOpen} darkMode={{ isDarkMode, toggleDarkMode }} />
      <Header toggleNavigation={toggleNavigation} />
      <main className="min-h-full flex flex-col items-center bg-stone-200 dark:bg-neutral-800">
        {childrenWithProps}
      </main>
    </>
  );
};
export default Layout;
