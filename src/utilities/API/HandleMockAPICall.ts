import { MainCard } from "../../interfaces/apiResponseTypes";
import { APIVariables } from "../../interfaces/apiResponseTypes";
import json from "../../mockApi/mock.json";

export default function HandleMockAPICall(
  variables: APIVariables
): [MainCard[], boolean] {
  const { perPage, page } = variables;
  const startIndex = page <= 1 ? 0 : perPage * (page - 1);
  const endIndex = startIndex + perPage;
  const response = json.slice(startIndex, endIndex) as MainCard[];

  const hasNextPage = startIndex + response.length < json.length;
  return [response, hasNextPage];
}
