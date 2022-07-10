import { useLayoutEffect, useState } from "react";

const Navigation = ({ isOpen }: { isOpen: boolean }) => {
  //prevent on page load component flicker
  const [initialVisibility, setInitialVisibility] = useState("hidden");
  useLayoutEffect(() => {
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
        const classNames = e.currentTarget.classList;
        if (classNames.contains("animate-slide-out-left"))
          classNames.add("hidden");
        e.currentTarget.focus();
      }}
    >
      <h3>My Profile | Sign In</h3>
      <h3>Search</h3>
      <h3>My List</h3>
    </nav>
  );
};
export default Navigation;
