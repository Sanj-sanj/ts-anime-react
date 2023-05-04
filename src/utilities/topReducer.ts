import { ShowStatus } from "../interfaces/apiResponseTypes";
import { Actions, InitialConfig } from "../interfaces/initialConfigTypes";
import { ShowListDetails, UserShowStatus } from "../interfaces/UserPreferences";

const appReducer = (state: InitialConfig, action: Actions): InitialConfig => {
  switch (action.type) {
    case "UPDATE_VARIABLES":
      if (
        typeof action.payload === "object" &&
        "seasonYear" in action.payload
      ) {
        return { ...state, variables: action.payload };
      }
      return state;

    case "UPDATE_NEXT_PAGE_AVAILABLE": {
      if (action.payload) {
        const { season, year, format, displayClientAmmount } = action.payload;
        const hasNextPage =
          displayClientAmmount < state.cards[season]?.[year]?.[format]?.length;

        return {
          ...state,
          client: { ...state.client, nextPageAvailable: hasNextPage },
        };
      }
      return state;
    }

    case "UPDATE_CARDS":
      if (Array.isArray(action.payload)) {
        const { season, seasonYear, format } = state.variables;
        const previousCards = state.cards[season]?.[seasonYear]?.[format] || [];
        return {
          ...state,
          cards: {
            ...state.cards,
            [season]: {
              ...state.cards[season],

              [seasonYear]: {
                ...state.cards[season]?.[seasonYear],
                [format]: [...previousCards, ...action.payload],
              },
            },
          },
        };
      }
      return state;
    case "UPDATE_SORT": {
      if (action.payload) {
        const { sort } = action.payload;
        return { ...state, sort };
      }
      return state;
    }
    case "TOGGLE_MODAL": {
      const modalRoot = document.getElementById("modalRoot") as HTMLElement;
      if (action.payload.action === "CLOSE") {
        modalRoot.classList.add("invisible");
        return {
          ...state,
          client: {
            ...state.client,
            overlay: {
              ...state.client.overlay,
              modal: { entryPoint: undefined, active: false },
            },
          },
        };
      }
      if (action.payload.action === "OPEN") {
        modalRoot.classList.remove("invisible");
        return {
          ...state,
          client: {
            ...state.client,
            overlay: {
              ...state.client.overlay,
              modal: { entryPoint: action.payload.entryPoint, active: true },
            },
            modalData: action.payload.data,
          },
        };
      }
      return state;
    }
    case "TOGGLE_NAVIGATION":
      return {
        ...state,
        client: {
          ...state.client,
          overlay: {
            ...state.client.overlay,
            navigation: { active: action.payload === "CLOSE" ? false : true },
          },
        },
      };

    case "UPDATE_PREFERENCE": {
      const lists = state.user.lists;
      const prevListItems = lists[action.payload.status];
      const id = action.payload.cardData.id as number;
      // rmove the previous entry if the user changes the show status from like watchign to skipped removed .
      const statusAndDetailsEntries = Object.entries(lists) as [
        UserShowStatus,
        ShowListDetails<number>
      ][];
      const foundInPreviousList = statusAndDetailsEntries.filter(
        ([key, list]) => {
          return key !== action.payload.status && list[id];
        }
      );
      if (foundInPreviousList) {
        foundInPreviousList.forEach(([status]) => {
          delete lists[status][id];
        });
      }
      return {
        ...state,
        user: {
          lists: {
            ...lists,
            [action.payload.status]: {
              ...prevListItems,
              [id]: action.payload.cardData,
            },
          },
        },
      };
    }

    default:
      return state;
  }
};
export default appReducer;
