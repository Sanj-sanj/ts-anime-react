import dayjs from "dayjs";
import { CalendarTimeSlots } from "../../../interfaces/CalendarTypes";
import ListButton from "../../card/ListButton";

const CalendarByTimeline = ({
  calendarSlots,
  titlesLang,
  focusRef
}: {
  calendarSlots: CalendarTimeSlots,
  titlesLang: "romaji" | "english",
  focusRef: React.MutableRefObject<HTMLButtonElement | null>
}) => {

  return (
    <div className="w-full bg-slate-800 flex justify-between">
      {calendarSlots.map(({ entries, day }) => {
        return (
          <div
            key={day}
            className="text-center w-full border-x border-t border-slate-500"
          >
            {entries.map(({ date, shows }) => {
              return (
                <div key={date}>
                  <h2
                    className={`text-3xl text-blue-400 ${
                      dayjs().format("ddd MMM DD") === date
                        ? "bg-teal-600 text-pink-50"
                        : ""
                    }`}
                  >
                    {date}
                  </h2>
                  <div className="flex w-full">
                    <div className="w-2 min-w-[0.5rem] max-w-[0.5rem] bg-gray-400 flex items-center"></div>
                    <div className="bg-slate-300 py-6 w-full">
                      {shows.map((timeSlot) => {
                        const time = Object.keys(timeSlot)[0];
                        const cards = timeSlot[time];
                        return (
                          <div key={`${time}-${day}`}>
                            <h3 className='bg-amber-100'>{time}</h3>
                            {cards.map(
                              ({
                                nextAiringEpisode,
                                episodes,
                                title,
                                id,
                                status,
                                coverImage,
                              }, i, cards) => (
                                <div key={id} className="flex w-full relative">
                                  <span className="absolute -left-2 -top-3">
                                    <ListButton
                                      card={cards[i]}
                                      focusHandler={(ref: HTMLButtonElement) => {
                                        focusRef.current = ref;
                                      }}
                                    />
                                  </span>
                                  <img
                                    src={coverImage.medium || ""}
                                    alt=""
                                    className="w-12 h-[72px]"
                                  />
                                  <div className="w-full">
                                    <h4
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
                                    </h4>
                                    <p className="text-right text-sm font-bold mr-2 text-teal-900">
                                      Ep:{" "}
                                      {status === "FINISHED"
                                        ? episodes
                                        : `${
                                            nextAiringEpisode?.episode || "???"
                                          }`}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
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
