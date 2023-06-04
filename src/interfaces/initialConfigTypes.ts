import { APIVariables, NewEpisodeCards, Season } from "./apiResponseTypes";
import { MainCard } from "./apiResponseTypes";
import {
  ListDetails,
  UserPreferences,
  UserShowStatus,
} from "./UserPreferencesTypes";

export type SeasonCards<Year extends number> = {
  [Y in Year]: {
    TV: MainCard[];
    OVA: MainCard[];
    MOVIE: MainCard[];
  };
};

export type SortableBy = "Rating" | "Popularity" | "Countdown";

export type ModalEntryPoint = "card" | "new release" | undefined;
export type ClientVariables = {
  nextPageAvailable: boolean;
  startIndex: number;
  perPage: number;
  season: Season;
  seasonYear: number;
  overlay: {
    modal: {
      entryPoint: ModalEntryPoint;
      active: boolean;
    };
    navigation: {
      active: boolean;
    };
  };
};

export type ValidFormats = "TV" | "MOVIE" | "OVA";

export type InitialConfig = {
  variables: APIVariables;
  client: ClientVariables;
  user: {
    lists: UserPreferences;
    newEpisodesAvailable: NewEpisodeCards[] | undefined;
    modalData: MainCard | undefined;
  };
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
      type: "UPDATE_CLIENT";
      payload: ClientVariables;
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
            entryPoint: "card";
            data?: MainCard;
          }
        | {
            action: "OPEN";
            entryPoint: "new release";
            data?: NewEpisodeCards[];
          }
        | {
            action: "CLOSE";
          };
    }
  | {
      type: "TOGGLE_NAVIGATION";
      payload: "OPEN" | "CLOSE";
    }
  | {
      type: "UPDATE_PREFERENCE";
      payload: {
        status: UserShowStatus;
        cardData: ListDetails;
      };
    }
  | {
      // takes previous userPrefrences and loads them into state.
      type: "LOAD_LIST";
      payload: UserPreferences;
    };
