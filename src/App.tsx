import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppProvider from "./utilities/Context/AppContext";
import Layout from "./components/layout/Layout";
import CardContainer from "./components/pages/cardView/CardContainer";
import UserList from "./components/pages/UserList/UserList";

const root = createRoot(document.getElementById("root") as HTMLElement);

const App = () => {
  console.log("rendering App"); //eslint-disable-line

  const LayoutWithContext = () => (
    <AppProvider>
      <Layout />
    </AppProvider>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutWithContext />,
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
root.render(<App />);
