import { MainCard } from "../../interfaces/apiResponseTypes";
import { APIVariables } from "../../interfaces/apiResponseTypes";
// import json from "../../mockApi/mock.json";
import json2 from "../../mockApi/mock2.json";

export default async function HandleMockAPICall(
  variables: APIVariables
): Promise<MainCard[]> {
  const { format, season, seasonYear } = variables;
  const mappedJson = json2.map((section) => section);

  const response2 = mappedJson[0][season]?.[seasonYear.toString()]?.[
    format
  ] as MainCard[];

  return new Promise<MainCard[]>((res) =>
    setTimeout(
      () => res(response2 || []),
      Math.floor((Math.random() * (response2.length * 100)) / 2)
    )
  ).then((v) => v);
}
