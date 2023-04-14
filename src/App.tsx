import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import CardContainer from "./components/card/CardContainer";
import Layout from "./components/layout/Layout";
import AppProvider from "./utilities/Context/AppContext";

const root = createRoot(document.getElementById("root") as HTMLElement);
const App = () => {
  console.log("rendering App");

  return (
    <StrictMode>
      <AppProvider>
        <Layout>
          <CardContainer />
        </Layout>
      </AppProvider>
    </StrictMode>
  );
};
// console.log(ReactDOM.version);
root.render(<App />);
