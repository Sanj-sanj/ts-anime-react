import React, { useEffect, useRef, useState, MutableRefObject } from "react";
import InputSearchAnime from "./InputSearchAnime";

const Navigation = ({ isOpen }: { isOpen: boolean }) => {
  /* 
  We set the component to initially hold the tailwindCSS class 'hidden' to hide the navbar on initial page builds. 
  We then use a 'useEffect' which conditionally proceeds on the basis that the navbar is being opened for the first time. 
  Finally we swap the initial state of 'hidden' to an empty string to resume normal component functionality.
  */

  const [initialVisibility, setInitialVisibility] = useState("hidden");
  const searchInput: MutableRefObject<HTMLInputElement | null> = useRef(null);

  function searchAutoFocus() {
    if (searchInput.current && isOpen) {
      searchInput.current.focus();
    }
  }

  function hideNavOnClose(e: React.AnimationEvent<HTMLElement>) {
    const classNames = e.currentTarget.classList;
    if (classNames.contains("animate-slide-out-left")) {
      classNames.add("hidden");
    }
  }

  useEffect(() => {
    if (isOpen === true && initialVisibility === "hidden") {
      setInitialVisibility("");
    }
  }, [isOpen]);

  return (
    <nav
      className={`${initialVisibility} absolute flex flex-col h-screen p-4 bg-slate-200 ${
        isOpen && initialVisibility === ""
          ? "animate-slide-in-left"
          : "animate-slide-out-left"
      } `}
      onAnimationEnd={(e) => {
        hideNavOnClose(e);
        searchAutoFocus();
      }}
    >
      <h3>My Profile | Sign In</h3>
      <InputSearchAnime inputRef={searchInput} />
      <h3>My List</h3>
    </nav>
  );
};

export default Navigation;
