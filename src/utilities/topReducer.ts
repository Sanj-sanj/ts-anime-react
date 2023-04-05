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
        const { season, year, format, displayClientAmmount } = action.payload;
        console.log(state.cards);
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
    default:
      return state;
  }
};
export default appReducer;
