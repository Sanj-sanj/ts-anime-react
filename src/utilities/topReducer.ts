import { Actions, InitialConfig } from "../interfaces/initialConfigTypes";

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

    case "UPDATE_NEXT_PAGE_AVAILABLE":
      if (typeof action.payload === "boolean") {
        return { ...state, nextPageAvailable: action.payload };
      }
      return state;

    case "UPDATE_CARDS":
      if (Array.isArray(action.payload)) {
        const { season, seasonYear } = state.variables;
        const previousCards = state.cards[season][seasonYear] || [];
        return {
          ...state,
          cards: {
            ...state.cards,
            [season]: {
              ...state.cards[season],
              [seasonYear]: [...previousCards, ...action.payload],
            },
          },
        };
      }
      return state;
    case "UPDATE_SORT":
      if (action.payload) {
        return { ...state, sort: action.payload };
      }
      return state;
    default:
      return state;
  }
};
export default appReducer;
