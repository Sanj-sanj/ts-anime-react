import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Card from "./components/card/Card";
// import request from "./utilities/requestAnime";
import mockApi from "./mockApi/mockAPI";
import { mainCard } from "./interfaces/apiResponseTypes";
import { APIVariables } from "./interfaces/apiRequestTypes";
import { throttle } from "./utilities/utilities";

const apiVariables: APIVariables = {
  page: 1,
  perPage: 7,
  season: "WINTER",
  seasonYear: 2022,
  hasNextPage: true,
};
const App = () => {
  const [info, setInfo] = useState([] as mainCard[]);
  const [variables, setVariables] = useState(apiVariables);
  const [nextPageAvailable, setNextPageAvailable] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [yScrollPos, setYScrollPos] = useState(0);

  const throttledScroll = throttle(getYOffset, 250);

  // async function requestAnimes(settings: APIVariables) {
  //   const [res, hasNextPage] = await request(settings);
  //   setNextPageAvailable(hasNextPage);
  //   setInfo(info.concat(res));
  // }

  function requestMockAPIAnimes(settings: APIVariables) {
    //Sends a request with the variable settings, the API response will return a boolean hasNextPage, this will determine subsequent network request based on scroll position (currently)
    const [res, hasNextPage] = mockApi(settings);
    setNextPageAvailable(hasNextPage);
    setInfo(info.concat(res));
  }
  function getYOffset() {
    const position = window.scrollY;
    // console.log(position);
    setYScrollPos(position);
  }

  function isBottomOfPage() {
    return yScrollPos + window.innerHeight === document.body.clientHeight
      ? true
      : null;
  }

  useEffect(() => {
    if (isFetching) {
      // void requestAnimes(variables);
      void requestMockAPIAnimes(variables);
      setIsFetching(false);
      const YscrollPositionResetID = setTimeout(
        () => window.scrollTo(0, yScrollPos),
        0
      );
      return () => clearTimeout(YscrollPositionResetID);
    }
  }, [isFetching]);

  useEffect(() => {
    window.addEventListener("scroll", throttledScroll);
    if (isBottomOfPage() && nextPageAvailable) {
      const newVariables = { ...variables, page: variables.page + 1 };
      setYScrollPos(yScrollPos - 1);
      setVariables(newVariables);
      setIsFetching(true);
    }
    return () => window.removeEventListener("scroll", throttledScroll);
  });

  return (
    <div className="container flex flex-col p-3 ">
      {info && !isFetching
        ? info.map(({ id, title, season, coverImage, type, meanScore }) => (
            <Card
              key={id}
              title={
                title.english || title.romaji || title.native || "not found"
              }
              season={season}
              coverImage={coverImage}
              type={type}
              meanScore={meanScore}
            />
          ))
        : null}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
