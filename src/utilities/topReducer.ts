import { Actions, InitialConfig } from "../interfaces/initialConfigTypes";
import {
  ShowListDetails,
  UserShowStatus,
} from "../interfaces/UserPreferencesTypes";

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

    case "UPDATE_CLIENT":
      if (
        typeof action.payload === "object" &&
        "seasonYear" in action.payload
      ) {
        return { ...state, client: action.payload };
      }
      return state;

    case "UPDATE_CALENDAR": {
      if(Array.isArray(action.payload.calendar)) {
        return { ...state, 
          cards: {
            ...state.cards,
            CALENDAR: {
              SHOWS: action.payload.calendar,
              LAST_CALLED: action.payload.last_called
            }
          }
        }
      }
    }
    return state;

    case "UPDATE_CARDS":
      {
        const { format } = state.variables;
        const { season, seasonYear } = state.client;
        if (!action.payload.ongoing) {
          return {
            ...state,
            cards: {
              ...state.cards,
              [season]: {
                ...state.cards[season],
                [seasonYear]: {
                  ...state.cards[season]?.[seasonYear],
                  [format]: action.payload.cards,
                },
              },
            },
          };
        } else if (action.payload.ongoing) {
          return {
            ...state,
            cards: {
              ...state.cards,
              ONGOING: {
                ...state.cards.ONGOING,
                [format]: action.payload.cards,
              },
            },
          };
        }
      }
      return state;

    case "UPDATE_SORT": {
      if (action.payload) {
        const { sort } = action.payload;
        return { ...state, client: { ...state.client, sort } };
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
        if (action.payload.entryPoint === "card") {
          return {
            ...state,
            client: {
              ...state.client,
              overlay: {
                ...state.client.overlay,
                modal: { entryPoint: action.payload.entryPoint, active: true },
              },
            },
            user: { ...state.user, modalData: action.payload.data },
          };
        } else if (action.payload.entryPoint === "new release") {
          return {
            ...state,
            client: {
              ...state.client,
              overlay: {
                ...state.client.overlay,
                modal: { entryPoint: action.payload.entryPoint, active: true },
              },
            },
            user: { ...state.user, newEpisodesAvailable: action.payload.data },
          };
        }
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
      const card = action.payload.cardData;
      const id = card.id as number;
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
      card.userStatus = action.payload.status;
      const newState = {
        ...state,
        user: {
          ...state.user,
          lists: {
            ...lists,
            [action.payload.status]: {
              ...prevListItems,
              [id]: card,
            },
          },
        },
      };
      localStorage.setItem("userList", JSON.stringify(newState.user.lists));
      return newState;
    }

    case "LOAD_LIST": {
      return {
        ...state,
        user: {
          ...state.user,
          lists: action.payload,
        },
      };
    }

    case "TOGGLE_ONGOING": {
      if (action.payload.forceMode === true) {
        return {
          ...state,
          client: { ...state.client, showOngoing: true },
        };
      } else {
        return {
          ...state,
          client: { ...state.client, showOngoing: false },
        };
      }
    }
    case "TOGGLE_LANGUAGE": {
      if (action.payload === "english") {
        localStorage.setItem("titlePref", "english");
        return { ...state, client: { ...state.client, titlesLang: "english" } };
      } else {
        localStorage.setItem("titlePref", "romaji");
        return { ...state, client: { ...state.client, titlesLang: "romaji" } };
      }
    }
    default:
      return state;
  }
};
export default appReducer;
