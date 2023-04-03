import React, {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from "react";
import { APIVariables } from "../../interfaces/apiResponseTypes";
import { Initial } from "../../utilities/configVariables";
import appReducer from "../../utilities/topReducer";
import {
  handleCardContainerOnClick,
  handleCardContainerScroll,
  throttle,
} from "../../utilities/utilities";
import Card from "./Card";
import { Actions } from "../../interfaces/initialConfigTypes";
import {
  requestAniListAPI,
  requestMockAPI,
} from "../../utilities/API/requestCards_CardContainer";
import SortCardsBy from "../../utilities/Cards/Helper";

const CardContainer: FunctionComponent = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [{ variables, nextPageAvailable, cards, sort }, dispatch] = useReducer(
    appReducer,
    Initial
  );
  const { season, seasonYear } = variables;

  const [display, setDisplay] = useState(cards[season][seasonYear] || []);

  const callNextPageOnScroll = throttle<
    [
      EventTarget & HTMLDivElement,
      React.Dispatch<Actions>,
      APIVariables,
      React.Dispatch<React.SetStateAction<boolean>>
    ]
  >(handleCardContainerScroll);

  useLayoutEffect(() => {
    if (cards[season] && cards[season][seasonYear]) {
      setDisplay(SortCardsBy(sort, cards[season][seasonYear]));
    }
  }, [cards]);

  useEffect(() => {
    if (isFetching) {
      void requestAniListAPI(variables, dispatch);
      // void requestMockAPI(variables, dispatch);
      setIsFetching(false);
    }
  }, [isFetching]);
  return (
    <div
      className="overflow-y-scroll w-screen flex flex-col items-center h-[90vh]"
      onScroll={(e) =>
        nextPageAvailable &&
        callNextPageOnScroll([
          e.currentTarget,
          dispatch,
          variables,
          setIsFetching,
        ])
      }
    >
      <ol className="flex flex-wrap whitespace-pre p-2 w-full flex-auto justify-center">
        {display.length ? (
          display.map((card) => (
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
