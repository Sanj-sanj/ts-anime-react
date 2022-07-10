import Navigation from "../navigation/Navigation";
import Header from "../header/Header";
import { useState } from "react";

type Props = {
  children: JSX.Element;
};

const Layout = ({ children }: Props) => {
  const [isOpen, setisOpen] = useState(false);
  const toggleNavigation = () => setisOpen(!isOpen);

  return (
    <>
      {/* Navigation panel hidden on the left */}
      <Navigation isOpen={isOpen} />
      <Header toggleNavigation={toggleNavigation} />
      <main className="min-h-full flex flex-col items-center">{children}</main>
    </>
  );
};
export default Layout;
