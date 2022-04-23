import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";

import CardContainer from "./components/card/CardContainer";
import Layout from "./components/layout/Layout";
import appReducer from "./utilities/topReducer";
import { Initial } from "./utilities/configVariables";

const App = () => {
  const [{ variables, isFetching, nextPageAvailable, cards }, dispatch] =
    useReducer(appReducer, useContext(Initial));
  console.log("rendering App");

  return (
    <Layout>
      <Initial.Provider
        value={{ variables, isFetching, nextPageAvailable, cards, dispatch }}
      >
        <CardContainer cards={cards} />
      </Initial.Provider>
    </Layout>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
