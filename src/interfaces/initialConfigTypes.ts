import { APIVariables, Season } from "./apiResponseTypes";
import { MainCard } from "./apiResponseTypes";

type SeasonCards<Year extends number> = {
  [Y in Year]: {
    TV: MainCard[];
    OVA: MainCard[];
    MOVIE: MainCard[];
  };
};

export type SortableBy = "Rating" | "Popularity" | "Countdown";

export type ClientVariables = {
  nextPageAvailable: boolean;
  startIndex: number;
  perPage: number;
  isOpen: {
    modal: boolean;
    navigation: boolean;
  };
  modalData: MainCard | null;
};

export type ValidFormats = "TV" | "MOVIE" | "OVA";

export type InitialConfig = {
  variables: APIVariables;
  client: ClientVariables;
  cards: {
    WINTER: SeasonCards<number>;
    SPRING: SeasonCards<number>;
    SUMMER: SeasonCards<number>;
    FALL: SeasonCards<number>;
  };
  sort: SortableBy;
};

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
        format: ValidFormats;
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
    }
  | {
      type: "TOGGLE_MODAL";
      payload:
        | {
            action: "OPEN";
            data: MainCard;
          }
        | {
            action: "CLOSE";
          };
    }
  | {
      type: "TOGGLE_NAVIGATION";
      action: "OPEN" | "CLOSE";
    };
