import { APIVariables } from "../interfaces/apiRequestTypes";

export type InitialConfig = {
  variables: APIVariables;
  nextPageAvailable: boolean;
  isFetching: boolean;
  yScrollPosition: number;
};
