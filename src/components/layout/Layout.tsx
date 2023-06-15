import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Outlet } from "react-router-dom";
import Navigation from "../navigation/Navigation";
import Header from "../header/Header";
import Modal from "../modal/Modal";
import { setupDarkMode } from "../../utilities/layout/setupDarkMode";
import {
  useDispatchContext,
  useStateContext,
} from "../../utilities/Context/AppContext";
import { UserPreferences } from "../../interfaces/UserPreferencesTypes";
import requestNewEpisodesCheck from "../../utilities/API/requestNewEpisodesCheck";

const Layout = () => {
  const [isDarkMode, setIsDarkMode] = useState(setupDarkMode());
  const overlayRef = useRef<null | HTMLButtonElement>(null);
  const abortNewEpisode = useRef<null | AbortController>(null);
  const {
    client: { overlay },
  } = useStateContext();
  const dispatch = useDispatchContext();

  const openNavigation = () =>
    dispatch({ type: "TOGGLE_NAVIGATION", payload: "OPEN" });
  const closeModal = () =>
    dispatch({ type: "TOGGLE_MODAL", payload: { action: "CLOSE" } });

  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
  }
  function userListLoadAndCheckForUpdates() {
    abortNewEpisode.current = new AbortController();
    const listHistory = localStorage.getItem("userList");
    if (listHistory) {
      const list = JSON.parse(listHistory) as UserPreferences;
      dispatch({ type: "LOAD_LIST", payload: list });
      void requestNewEpisodesCheck(
        Object.keys(list.WATCHING)
          .concat(Object.keys(list.INTERESTED))
          .map((n) => +n),
        list,
        dispatch,
        abortNewEpisode.current.signal
      );
    }
  }

  if (isDarkMode) {
    document.querySelector("html")?.classList.add("dark");
    localStorage.setItem("dark", "true");
  } else {
    document.querySelector("html")?.classList.remove("dark");
    localStorage.setItem("dark", "false");
  }
  if (Object.entries(overlay).find(([, { active }]) => active) && overlayRef)
    overlayRef.current?.classList.replace("hidden", "block");
  else overlayRef.current?.classList.replace("block", "hidden");

  useEffect(() => {
    userListLoadAndCheckForUpdates();
    return () => {
      if (abortNewEpisode.current) abortNewEpisode.current.abort();
    };
  }, []);

  return (
    <>
      <button
        className="overlay w-screen h-screen bg-zinc-800 absolute opacity-70 z-20 hidden"
        ref={overlayRef}
      />
      {overlay.modal.active
        ? createPortal(
            <Modal
              closeModal={closeModal}
              entryPoint={overlay.modal.entryPoint}
            />,
            document.getElementById("modalRoot") as HTMLDivElement
          )
        : null}
      <Navigation darkMode={{ isDarkMode, toggleDarkMode }} />
      <Header openNavigation={openNavigation} />
      <main className="min-h-[90vh] flex flex-col items-center bg-stone-200 dark:bg-neutral-800">
        <Outlet />
      </main>
    </>
  );
};
export default Layout;
