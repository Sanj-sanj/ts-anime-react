import { Dayjs } from "dayjs";
import { AiringSchedule, APIVariables, NewEpisodeCards, Season } from "./apiResponseTypes";
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
  perPage: number;
  season: Season;
  seasonYear: number;
  showOngoing: boolean;
  titlesLang: "english" | "romaji";
  sort: SortableBy;
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
    newEpisodesAvailable: {
      available: NewEpisodeCards[] | undefined;
      last_called: Dayjs;
    };
    modalData: MainCard | undefined;
  };
  cards: {
    WINTER: SeasonCards<number>;
    SPRING: SeasonCards<number>;
    SUMMER: SeasonCards<number>;
    FALL: SeasonCards<number>;
    ONGOING: {
      TV: MainCard[];
      OVA: MainCard[];
      MOVIE: MainCard[];
    };
    CALENDAR: {
      LAST_CALLED: Dayjs;
      SHOWS: AiringSchedule[];
    };
  };
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
      type: "UPDATE_CARDS";
      payload: { cards: MainCard[]; ongoing: boolean };
    }
  | {
      type: "UPDATE_CALENDAR";
      payload: { calendar: AiringSchedule[], last_called: Dayjs};
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
            data: {
              available: NewEpisodeCards[];
              last_called: Dayjs;
            };
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
    }
  | {
      type: "TOGGLE_ONGOING";
      payload: {
        forceMode?: boolean;
      };
    }
  | {
      type: "TOGGLE_LANGUAGE";
      payload: "english" | "romaji";
    };
