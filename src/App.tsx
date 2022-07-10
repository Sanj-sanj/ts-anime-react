import ReactDOM from "react-dom";

import CardContainer from "./components/card/CardContainer";
import Layout from "./components/layout/Layout";
// import Header from "./components/header/Header";

const App = () => {
  console.log("rendering App");

  return (
    <Layout>
      {/* <Header /> */}
      <CardContainer />
    </Layout>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
