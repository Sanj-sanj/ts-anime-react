import { FunctionComponent, useContext, useEffect } from "react";
import { APIVariables } from "../../interfaces/apiRequestTypes";
import { MainCard } from "../../interfaces/apiResponseTypes";
import callMockApi from "../../mockApi/mockAPI";
import { Initial } from "../../utilities/configVariables";
import { handleCardContainerScroll, throttle } from "../../utilities/utilities";
import Card from "./Card";

const CardContainer: FunctionComponent<{ cards: MainCard[] }> = ({ cards }) => {
  const { variables, isFetching, nextPageAvailable, dispatch } =
    useContext(Initial);

  //this probably isnt correct typescript
  const throttledHandler = throttle(handleCardContainerScroll);

  //Request from Anilist API
  // async function requestAnimes(settings: APIVariables) {
  //   const [res, hasNextPage] = await requestAnime(settings);
  //   dispatch({ type: "UPDATE_NEXT_PAGE_AVAILABLE", payload: hasNextPage });
  //   dispatch({ type: "UPDATE_INFO", payload: cards.concat(res) });
  // }

  function requestMockAPIAnimes(settings: APIVariables) {
    //Sends a request with the variable settings, the API response will return a boolean hasNextPage, this will determine subsequent network request based on scroll position (currently)
    const [res, hasNextPage] = callMockApi(settings);
    console.log(hasNextPage);
    dispatch({ type: "UPDATE_NEXT_PAGE_AVAILABLE", payload: hasNextPage });
    dispatch({ type: "UPDATE_INFO", payload: cards.concat(res) });
  }

  useEffect(() => {
    if (isFetching) {
      // void requestAnimes(variables);
      void requestMockAPIAnimes(variables);
      dispatch({ type: "UPDATE_IS_FETCHING", payload: false });
    }
  }, [isFetching]);
  return (
    <div
      className="container overflow-y-scroll h-screen"
      onScroll={(e) =>
        nextPageAvailable
          ? throttledHandler(e.currentTarget, dispatch, variables)
          : null
      }
    >
      {cards.map(({ id, title, season, coverImage, type, meanScore }) => (
        <Card
          key={id}
          title={title.english || title.romaji || title.native || "not found"}
          season={season}
          coverImage={coverImage}
          type={type}
          meanScore={meanScore}
        />
      ))}
    </div>
  );
};

export default CardContainer;
