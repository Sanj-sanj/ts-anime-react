import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Card from "./components/card/Card";
// import request from "./utilities/requestAnime";
import mockApi from "./mockApi/mockAPI";
import { mainCard } from "./interfaces/apiResponseTypes";
import { APIVariables } from "./interfaces/apiRequestTypes";

const App = () => {
  const [info, setInfo] = useState([] as mainCard[]);
  const [isFetching, setIsFetching] = useState(true);

  // async function requestAnimes() {
  //   const res = await request();
  //   console.log(JSON.stringify(res));
  //   setInfo(res);
  // }
  function requestMockAPIAnimes() {
    const variables: APIVariables = {
      page: 1,
      perPage: 10,
      season: "WINTER",
      seasonYear: 2022,
    };
    const res = mockApi(variables);
    setInfo(res);
  }

  useEffect(() => {
    // void requestAnimes();
    void requestMockAPIAnimes();
    setIsFetching(false);
  }, []);

  return (
    <div className="container">
      {info && !isFetching
        ? info.map((data) => (
            <Card
              key={data.id}
              title={data.title}
              desc={data.season}
              cover={data.coverImage.medium}
            />
          ))
        : null}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
