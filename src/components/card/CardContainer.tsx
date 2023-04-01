import { FunctionComponent, useEffect, useReducer, useState } from "react";
import { APIVariables } from "../../interfaces/apiResponseTypes";
import callMockApi from "../../mockApi/mockAPI";
import requestAnime from "../../utilities/requestAnime";
import { Initial } from "../../utilities/configVariables";
import appReducer from "../../utilities/topReducer";
import {
  handleCardContainerOnClick,
  handleCardContainerScroll,
  throttle,
} from "../../utilities/utilities";
import Card from "./Card";
import { Actions } from "../../interfaces/initialConfigTypes";

const CardContainer: FunctionComponent = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [{ variables, nextPageAvailable, cards }, dispatch] = useReducer(
    appReducer,
    Initial
  );

  const callNextPageOnScroll = throttle<
    [
      EventTarget & HTMLDivElement,
      React.Dispatch<Actions>,
      APIVariables,
      React.Dispatch<React.SetStateAction<boolean>>
    ]
  >(handleCardContainerScroll);

  //Request from Anilist API
  async function requestAnimes(settings: APIVariables) {
    const [res, hasNextPage] = await requestAnime(settings);
    console.log("calling ANILIST_API"); //eslint-disable-line
    dispatch({ type: "UPDATE_NEXT_PAGE_AVAILABLE", payload: hasNextPage });
    dispatch({ type: "UPDATE_CARDS", payload: cards.concat(res) });
  }

  function requestMockAPIAnimes(settings: APIVariables) {
    //Sends a request with the variable settings, the API response will return a boolean hasNextPage, this will determine subsequent network request based on scroll position (currently)
    const [res, hasNextPage] = callMockApi(settings);
    console.log("calling MOCK_API"); //eslint-disable-line
    dispatch({ type: "UPDATE_NEXT_PAGE_AVAILABLE", payload: hasNextPage });
    dispatch({ type: "UPDATE_CARDS", payload: cards.concat(res) });
  }

  useEffect(() => {
    if (isFetching) {
      // void requestAnimes(variables);
      void requestMockAPIAnimes(variables);
      setIsFetching(false);
    }
  }, [isFetching]);
  return (
    <div
      className="overflow-y-scroll w-screen flex flex-col items-center h-[90vh]"
      onScroll={(e) =>
        nextPageAvailable
          ? callNextPageOnScroll([
              e.currentTarget,
              dispatch,
              variables,
              setIsFetching,
            ])
          : null
      }
    >
      <ol className="flex flex-wrap whitespace-pre p-2 w-full flex-auto justify-center">
        {cards ? (
          cards.map((card) => (
            <Card key={card.id || card.title.romaji} card={card} />
          ))
        ) : (
          <li>No results found.</li>
        )}
      </ol>
      {nextPageAvailable ? (
        <button
          className="border-2 bg-slate-200 border-blue-800 p-2"
          onClick={() =>
            handleCardContainerOnClick(dispatch, variables, setIsFetching)
          }
        >
          Click here if more results do not load.
        </button>
      ) : (
        <aside>You&apos;ve reached the end!</aside>
      )}
    </div>
  );
};

export default CardContainer;
