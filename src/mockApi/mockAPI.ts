import { mainCard } from "../interfaces/apiResponseTypes";
import { APIVariables } from "../interfaces/apiRequestTypes";
import json from "./mock.json";

export default function callMockApi(variables: APIVariables): mainCard[] {
  const { perPage, page } = variables;
  const startIndex = page <= 1 ? 0 : perPage * (page - 1);
  const endIndex = startIndex + perPage;
  const response = json.slice(startIndex, endIndex);

  return response;
}
