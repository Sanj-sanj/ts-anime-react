import { MainCard } from "../../interfaces/apiResponseTypes";
import { APIVariables } from "../../interfaces/apiResponseTypes";
// import json from "../../mockApi/mock.json";
import json2 from "../../mockApi/mock2.json";

export default function HandleMockAPICall(variables: APIVariables): MainCard[] {
  const { format, season, seasonYear } = variables;
  const mappedJson = json2.map((section) => section);

  const response2 = mappedJson[0][season]?.[seasonYear.toString()]?.[
    format
  ] as MainCard[];

  return response2;
}
