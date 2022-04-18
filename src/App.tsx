import React, { useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
// import request from "./utilities/requestAnime";
import mockApi from "./mockApi/mockAPI";
// import { MainCard } from "./interfaces/apiResponseTypes";
import { APIVariables } from "./interfaces/apiRequestTypes";
import { throttle } from "./utilities/utilities";
import CardContainer from "./components/card/CardContainer";
import appReducer from "./utilities/topReducer";
// import { InitialConfig } from "./interfaces/initialConfigTypes";
import { initial } from "./utilities/configVariables";
// import { MainCard } from "./interfaces/apiResponseTypes";
const App = () => {
  const [
    { variables, yScrollPosition, isFetching, nextPageAvailable, cards },
    dispatch,
  ] = useReducer(appReducer, initial);

  // const [cards, setInfo] = useState([] as MainCard[]);
  const throttledScroll = throttle(getYOffset, 250);

  // async function requestAnimes(settings: APIVariables) {
  //   const [res, hasNextPage] = await request(settings);
  //   setNextPageAvailable(hasNextPage);
  //   setInfo(cards.concat(res));
  // }

  function requestMockAPIAnimes(settings: APIVariables) {
    //Sends a request with the variable settings, the API response will return a boolean hasNextPage, this will determine subsequent network request based on scroll position (currently)
    const [res, hasNextPage] = mockApi(settings);
    dispatch({ type: "UPDATE_NEXT_PAGE_AVAILABLE", payload: hasNextPage });
    // setInfo(cards.concat(res));
    dispatch({ type: "UPDATE_INFO", payload: cards.concat(res) });
  }
  function getYOffset() {
    const position = window.scrollY;
    dispatch({ type: "UPDATE_Y_POSITION", payload: position });
  }

  function isBottomOfPage() {
    return yScrollPosition + window.innerHeight === document.body.clientHeight
      ? true
      : false;
  }

  useEffect(() => {
    if (isFetching) {
      // void requestAnimes(variables);
      void requestMockAPIAnimes(variables);
      dispatch({ type: "UPDATE_IS_FETCHING", payload: false });
      const YscrollPositionResetID = setTimeout(
        () => window.scrollTo(0, yScrollPosition),
        0
      );
      return () => clearTimeout(YscrollPositionResetID);
    }
  }, [isFetching]);

  useEffect(() => {
    //rerender runs 4 times when new api results come in...
    console.log("addScrollEventListener Effect");
    window.addEventListener("scroll", throttledScroll);
    if (isBottomOfPage() && nextPageAvailable) {
      const newVariables = { ...variables, page: variables.page + 1 };
      dispatch({ type: "UPDATE_VARIABLES", payload: newVariables });
      dispatch({ type: "UPDATE_Y_POSITION", payload: yScrollPosition - 1 });
      dispatch({ type: "UPDATE_IS_FETCHING", payload: true });
    }
    return () => window.removeEventListener("scroll", throttledScroll);
  });

  return (
    <div className="flex justify-center w-full">
      <div className=" container">{CardContainer(cards)}</div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
