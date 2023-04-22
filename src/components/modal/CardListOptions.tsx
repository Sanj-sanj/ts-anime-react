import { FunctionComponent, MutableRefObject, useState } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { ListDetails, UserShowStatus } from "../../interfaces/UserPreferences";
import { useDispatchContext } from "../../utilities/Context/AppContext";

const CardListOptions: FunctionComponent<{
  modalData: MainCard | null;
  hideInput: MutableRefObject<boolean>;
}> = ({ modalData, hideInput }) => {
  const dispatch = useDispatchContext();
  const [tempStatus, setTempStatus] = useState<UserShowStatus>();
  const [tempDetails, setTempDetails] = useState<ListDetails>();

  return (
    <div className="dark:text-stone-300">
      <h2 className="font-bold text-2xl text-center">List Editor</h2>
      <hr className="border-slate-950 dark:border-stone-400 border-1 mb-2" />
      <h3 className="font-semibold text-xl text-center">
        {modalData?.title.english || modalData?.title.romaji}
      </h3>
      <hr className="border-slate-950 dark:border-stone-400 border-2" />

      <>
        <h4 className="text-center font-medium">My Stats</h4>
        <div className="flex w-full flex-col sm:flex-row">
          <div className="w-full sm:w-1/2">
            <div className="flex justify-between px-2">
              <p>Status:</p>
              <span>{tempStatus}</span>
            </div>
            <div className="flex justify-between px-2">
              <p>Progress:</p>
              <input
                className="w-28"
                hidden={hideInput.current}
                type="number"
                name="progress"
                id=""
              />
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="flex justify-between mx-2">
              <p>Started:</p>
              <input
                type="date"
                hidden={hideInput.current}
                name="start-date"
                id=""
              />
            </div>
            <div className="flex justify-between mx-2">
              <p>Completed:</p>
              <input
                type="date"
                hidden={hideInput.current}
                name="start-date"
                id=""
              />
            </div>
          </div>
        </div>
      </>

      {modalData ? (
        <>
          <div className="flex w-full min-h-[10rem] justify-evenly items-center mt-4 dark:text-black">
            <button
              className="border rounded bg-lime-500 p-1 m-1 w-24"
              onClick={() => {
                setTempStatus("WATCHING");
                hideInput.current = false;
              }}
            >
              Watching
            </button>
            <button
              className="border rounded bg-indigo-400 p-1 m-1 w-24"
              onClick={() => setTempStatus("INTERESTED")}
            >
              Interested
            </button>
            <button
              className="border rounded bg-blue-400 p-1 m-1 w-24"
              onClick={() => setTempStatus("COMPLETED")}
            >
              Completed
            </button>
            <button
              className="border rounded bg-red-500 p-1 m-1 w-24"
              onClick={() => setTempStatus("DROPPED")}
            >
              Dropped
            </button>
            <button
              className="border rounded bg-amber-600 p-1 m-1 w-24"
              onClick={() => setTempStatus("SKIPPED")}
            >
              Skipped
            </button>
          </div>
          <button
            className="border rounded border-slate-950 dark:border-stone-400 w-20 p-1"
            onClick={() =>
              setTempDetails({
                id: modalData.id,
                season: modalData.season,
                year: modalData.seasonYear,
                title: modalData.title,
                currentEpisode: null,
                userScore: null,
                startedOn: null,
                completedOn: null,
                notes: null,
              })
            }
          >
            Save
          </button>
        </>
      ) : null}
    </div>
  );
};
export default CardListOptions;
