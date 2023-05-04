import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";
import {
  NextAiringEpisode,
  ShowStatus,
} from "../../interfaces/apiResponseTypes";

export default function setCountdownText(
  status: ShowStatus,
  nextAiringEpisode: NextAiringEpisode,
  setStateFN: Dispatch<SetStateAction<string | undefined>>
): void {
  type FAULTY = "FINISHED" | "CANCELED" | "HIATUS";
  const faultyStatus: FAULTY[] = ["FINISHED", "CANCELED", "HIATUS"];
  const found = faultyStatus.find((e) => e === status);
  if (found) {
    return setStateFN(found);
  }
  const now = dayjs();
  const then2 = dayjs(
    nextAiringEpisode?.airingAt && nextAiringEpisode.airingAt * 1000
  );
  const days = then2.diff(now, "d"),
    hours = then2.diff(now, "h") % 24,
    mins = then2.diff(now, "m") % 60,
    secs = then2.diff(now, "s") % 60;
  setStateFN(
    `Ep: ${nextAiringEpisode?.episode || "?"} - ${days}d ${hours}h ${
      mins <= 9 ? "0".concat(mins.toString()) : mins
    }m ${secs <= 9 ? "0".concat(secs.toString()) : secs}s`
  );
}
