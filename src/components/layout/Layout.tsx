import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Navigation from "../navigation/Navigation";
import Header from "../header/Header";
import Modal from "../modal/Modal";
import { setupDarkMode } from "../../utilities/layout/utilities";
import {
  useDispatchContext,
  useStateContext,
} from "../../utilities/Context/AppContext";

type Props = {
  children: JSX.Element;
};

const Layout = ({ children }: Props) => {
  const [isDarkMode, setIsDarkMode] = useState(setupDarkMode());
  const { client } = useStateContext();
  const dispatch = useDispatchContext();

  const toggleNavigation = () => dispatch({ type: "TOGGLE_NAVIGATION" });
  const closeModal = () =>
    dispatch({ type: "TOGGLE_MODAL", payload: { action: "CLOSE" } });

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
      {client.isOpen.modal ? (
        createPortal(
          <Modal closeModal={closeModal} />,
          document.getElementById("modalRoot") as HTMLDivElement
        )
      ) : (
        <></>
      )}
      {/* Navigation panel hidden on the left */}
      <Navigation darkMode={{ isDarkMode, toggleDarkMode }} />
      <Header toggleNavigation={toggleNavigation} />
      <main className="min-h-full flex flex-col items-center bg-stone-200 dark:bg-neutral-800">
        {children}
      </main>
    </>
  );
};
export default Layout;
