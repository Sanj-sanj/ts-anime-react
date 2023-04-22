import React, { useEffect, useRef, useState } from "react";
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
  const overlayRef = useRef<null | HTMLButtonElement>(null);
  const { client } = useStateContext();
  const dispatch = useDispatchContext();

  const openNavigation = () =>
    dispatch({ type: "TOGGLE_NAVIGATION", payload: "OPEN" });
  const closeModal = () =>
    dispatch({ type: "TOGGLE_MODAL", payload: { action: "CLOSE" } });

  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
  }

  useEffect(() => {
    if (Object.entries(client.isOpen).find(([, val]) => val) && overlayRef)
      overlayRef.current?.classList.replace("hidden", "block");
    else overlayRef.current?.classList.replace("block", "hidden");
  }, [client.isOpen]);

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
      <button
        className="overlay w-screen h-screen bg-zinc-800 absolute opacity-70 z-20 hidden"
        ref={overlayRef}
        onClick={() => {
          dispatch({ type: "TOGGLE_MODAL", payload: { action: "CLOSE" } });
          dispatch({ type: "TOGGLE_NAVIGATION", payload: "CLOSE" });
        }}
      />
      {client.isOpen.modal
        ? createPortal(
            <Modal closeModal={closeModal} />,
            document.getElementById("modalRoot") as HTMLDivElement
          )
        : null}
      <Navigation darkMode={{ isDarkMode, toggleDarkMode }} />
      <Header openNavigation={openNavigation} />
      <main className="min-h-full flex flex-col items-center bg-stone-200 dark:bg-neutral-800">
        {children}
      </main>
    </>
  );
};
export default Layout;
