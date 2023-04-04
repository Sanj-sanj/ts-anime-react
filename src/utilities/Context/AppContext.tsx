import React, { createContext, useContext, useReducer } from "react";
import { Actions, InitialConfig } from "../../interfaces/initialConfigTypes";
import { Initial } from "../configVariables";
import appReducer from "../topReducer";

export const AppStateContext = createContext<InitialConfig | null>(null);
export const AppDispatchContext = createContext<React.Dispatch<Actions> | null>(
  null
);

export function useStateContext() {
  return useContext(AppStateContext as React.Context<InitialConfig>);
}
export function useDispatchContext() {
  return useContext(
    AppDispatchContext as React.Context<React.Dispatch<Actions>>
  );
}

export default function AppProvider({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) {
  const [state, dispatch] = useReducer(appReducer, Initial);
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}
