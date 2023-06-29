import dayjs from "dayjs";
import { MainCard } from "../../../interfaces/apiResponseTypes";

const CalendarByTimeline = (
  slots: {
    entries: {
      [x: string]: {
        shows: {
          [x: string]: MainCard[];
        };
      };
    };
    day: number;
  }[],
  titlesLang: "english" | "romaji"
) => {
  return (
    <div className="w-full bg-slate-800 flex justify-between">
      {slots.map(({ day, entries }) => {
        return (
          <div
            key={day}
            className="text-center w-full border-x border-t border-slate-500"
          >
            {Object.entries(entries).map(([str, { shows }], i) => {
              if (i > 0) return <></>;
              return (
                <div key={`${str}-${i}`}>
                  <h2
                    className={`text-3xl text-blue-400 ${
                      dayjs().format("ddd MMM DD") === str
                        ? "bg-teal-600 text-pink-50"
                        : ""
                    }`}
                  >
                    {str}
                  </h2>
                  <div className="flex w-full">
                    <div className="w-2 min-w-[0.5rem] max-w-[0.5rem] bg-gray-400 flex items-center"></div>
                    <div className="bg-slate-300 py-6 w-full">
                      {Object.entries(shows).map(([hour, shows]) => {
                        return (
                          <div key={`${day}-${hour}`} className="w-full">
                            <div className="w-full flex">
                              <div className="w-full">
                                <div className="">{hour}</div>
                                {shows.map(
                                  ({
                                    id,
                                    coverImage,
                                    title,
                                    episodes,
                                    status,
                                    nextAiringEpisode,
                                  }) => (
                                    <div key={id} className="flex w-full">
                                      <img
                                        src={coverImage.medium || ""}
                                        alt=""
                                        className="w-12 h-[72px]"
                                      />
                                      <div className="w-full">
                                        <h3
                                          className="text-left w-full  text-ellipsis line-clamp-2 overflow-hidden"
                                          style={{ wordBreak: "break-word" }}
                                          title={
                                            title[titlesLang] ||
                                            title.romaji ||
                                            title.english ||
                                            ""
                                          }
                                        >
                                          {title[titlesLang] ||
                                            title.romaji ||
                                            title.english ||
                                            ""}
                                        </h3>
                                        <p className="text-right text-sm font-bold mr-2 text-teal-900">
                                          Ep:{" "}
                                          {status === "FINISHED"
                                            ? episodes
                                            : `${
                                                nextAiringEpisode?.episode ||
                                                "???"
                                              }`}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
export default CalendarByTimeline;
