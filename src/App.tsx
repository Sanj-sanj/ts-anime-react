import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import CardContainer from "./components/card/CardContainer";
import Layout from "./components/layout/Layout";
import AppProvider from "./utilities/Context/AppContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserList from "./components/UserList/UserList";

const root = createRoot(document.getElementById("root") as HTMLElement);

const App = () => {
  console.log("rendering App"); //eslint-disable-line

  const LayoutWithProvisions = () => (
    <AppProvider>
      <Layout />
    </AppProvider>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutWithProvisions />,
      children: [
        { path: "/", element: <CardContainer /> },
        { path: "/list", element: <UserList /> },
      ],
    },
  ]);

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
};
// console.log(ReactDOM.version);
root.render(<App />);
