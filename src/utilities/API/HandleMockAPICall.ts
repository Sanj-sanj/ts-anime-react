import { MainCard } from "../../interfaces/apiResponseTypes";
import { APIVariables } from "../../interfaces/apiResponseTypes";
// import json from "../../mockApi/mock.json";
import json2 from "../../mockApi/mock2.json";

export default async function jjjjHandleMockAPICall(
  variables: APIVariables,
  fetchingOngoing: boolean
): Promise<MainCard[]> {
  const { format, season, seasonYear } = variables;

  const mappedJson = json2.map((section) => section);

  const mockCards = mappedJson[0][season]?.[seasonYear]?.[format] as MainCard[];

  const responseOngoing = mappedJson[0].ONGOING?.[format] as MainCard[];

  return new Promise<MainCard[]>((res) => {
    const cards = fetchingOngoing ? responseOngoing : mockCards || [];

    setTimeout(
      () => res(cards),
      // 2
      Math.floor((Math.random() * (cards.length || 20) * 50) / 2)
    );
  }).then((v) => v);
}
