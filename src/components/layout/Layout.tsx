import Navigation from "../navigation/Navigation";
import Header from "../header/Header";
import React, { useEffect, useState } from "react";
import { setupDarkMode } from "../../utilities/layout/utilities";
import AppProvider from "../../utilities/Context/AppContext";

type Props = {
  children: JSX.Element;
};

const Layout = ({ children }: Props) => {
  const [isOpen, setisOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(setupDarkMode());
  const toggleNavigation = () => setisOpen(!isOpen);

  // const {AppDispatchContext, AppStateContext} = Contexts

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

  return (
    <>
      {/* Navigation panel hidden on the left */}
      <AppProvider>
        <Navigation isOpen={isOpen} darkMode={{ isDarkMode, toggleDarkMode }} />
        <Header toggleNavigation={toggleNavigation} />
        <main className="min-h-full flex flex-col items-center bg-stone-200 dark:bg-neutral-800">
          {children}
        </main>
      </AppProvider>
    </>
  );
};
export default Layout;
