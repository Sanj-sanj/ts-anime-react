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

    case "UPDATE_NEXT_PAGE_AVAILABLE": {
      if (action.payload) {
        const { season, year, displayClientAmmount } = action.payload;
        const hasNextPage =
          displayClientAmmount < state.cards[season][year].length;

        return {
          ...state,
          client: { ...state.client, nextPageAvailable: hasNextPage },
        };
      }
      return state;
    }

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
    case "UPDATE_SORT": {
      if (action.payload) {
        const { sort } = action.payload;
        return { ...state, sort };
      }
      return state;
    }
    default:
      return state;
  }
};
export default appReducer;
