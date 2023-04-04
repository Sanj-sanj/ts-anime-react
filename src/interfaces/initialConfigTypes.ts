import { APIVariables, Season } from "./apiResponseTypes";
import { MainCard } from "./apiResponseTypes";

type SeasonYear<Year extends number> = {
  [Y in Year]: MainCard[];
};

export type SortableBy = "Rating" | "Popularity" | "Countdown";

export type ClientVariables = {
  nextPageAvailable: boolean;
  startIndex: number;
  perPage: number;
};

export type InitialConfig = {
  variables: APIVariables;
  client: ClientVariables;
  cards: {
    WINTER: SeasonYear<number>;
    SPRING: SeasonYear<number>;
    SUMMER: SeasonYear<number>;
    FALL: SeasonYear<number>;
  };
  sort: SortableBy;
};

//Type definitions for topReducer
// type ActionTypes =
//   | "UPDATE_VARIABLES"
//   | "UPDATE_IS_FETCHING"
//   | "UPDATE_NEXT_PAGE_AVAILABLE"
//   | "UPDATE_CARDS"
//   | "UPDATE_SORT";
// type Payload = string | number | boolean | APIVariables | MainCard[];

export type Actions =
  | {
      type: "UPDATE_VARIABLES";
      payload: APIVariables;
    }
  | {
      type: "UPDATE_IS_FETCHING";
      payload: boolean;
    }
  | {
      type: "UPDATE_NEXT_PAGE_AVAILABLE";
      payload: {
        season: Season;
        year: number;
        displayClientAmmount: number;
      };
    }
  | {
      type: "UPDATE_CARDS";
      payload: MainCard[];
    }
  | {
      type: "UPDATE_SORT";
      payload: {
        sort: SortableBy;
      };
    };
