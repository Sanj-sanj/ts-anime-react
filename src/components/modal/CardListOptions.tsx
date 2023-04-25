import {
  FunctionComponent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { ListDetails, UserShowStatus } from "../../interfaces/UserPreferences";
import { useDispatchContext } from "../../utilities/Context/AppContext";

const CardListOptions: FunctionComponent<{
  modalData: MainCard | null;
  unsavedChanges: MutableRefObject<boolean>;
}> = ({ modalData, unsavedChanges }) => {
  const hideInput = useRef(true);
  const formRef = useRef<HTMLFormElement | null>(null);
  const dispatch = useDispatchContext();
  const [unsavedNotification, setUnsavedNotification] =
    useState<JSX.Element | null>(null);
  const [tempStatus, setTempStatus] = useState<UserShowStatus>();
  const [tempDetails, setTempDetails] = useState<ListDetails>({
    id: modalData?.id || null,
    season: modalData?.season || null,
    year: modalData?.seasonYear || null,
    title: modalData?.title || null,
    currentEpisode: null,
    userScore: null,
    startedOn: null,
    completedOn: null,
    notes: null,
  });

  useEffect(() => {
    if (tempStatus !== undefined) {
      // || if tempStatus !== previous from user.lists[id#][STATUS]
      unsavedChanges.current = true;
      setUnsavedNotification(
        <div className="text-stone-200 bg-red-950 w-max px-2 py-1 text-center border border-red-400 rounded">
          <p>You have unsaved changes</p>
        </div>
      );
    }
    return () => {
      unsavedChanges.current = false;
    };
  }, [tempStatus, tempDetails]);

  const statusOnClick = (status: UserShowStatus) => {
    setTempStatus(status);
    hideInput.current = false;
  };

  return (
    <div className="dark:text-stone-300">
      <h2 className="font-bold text-2xl text-center">List Editor</h2>
      <hr className="border-slate-950 dark:border-stone-400 border-1 mb-2" />
      <h3 className="font-semibold text-xl text-center">
        {modalData?.title.english || modalData?.title.romaji}
      </h3>
      <hr className="border-slate-950 dark:border-stone-400 border-2" />
      <form ref={formRef} className="flex flex-col items-center">
        <h4 className="text-center font-medium">Show Status</h4>
        {unsavedNotification}
        <div className="flex w-full flex-col flex-wrap sm:flex-row">
          <div className="w-full sm:w-1/2">
            <div className="flex justify-between px-2 mb-2">
              <p>Status:</p>
              <span>{tempStatus}</span>
            </div>
            <div className="px-2 mb-2">
              <label className="flex justify-between w-full">
                Progress:
                <input
                  className="w-14 text-black text-center"
                  hidden={hideInput.current}
                  type="number"
                  name="progress"
                  onChange={(e) =>
                    setTempDetails({
                      ...tempDetails,
                      currentEpisode: +e.target.value,
                    })
                  }
                  id=""
                />
              </label>
            </div>
          </div>
          <div className="w-full sm:w-1/2 mb-2">
            <div className="mx-2 mb-2">
              <label className="flex justify-between w-full">
                Started:
                <input
                  type="date"
                  hidden={hideInput.current}
                  disabled={hideInput.current}
                  name="start-date"
                  id=""
                  onChange={(e) =>
                    setTempDetails({
                      ...tempDetails,
                      startedOn: e.target.value || null,
                    })
                  }
                  className="w-32 text-black"
                />
              </label>
            </div>
            <div className="mx-2 mb-2">
              <label className="flex justify-between w-full">
                Completed:
                <input
                  type="date"
                  hidden={hideInput.current}
                  disabled={hideInput.current}
                  name="completed-date"
                  id=""
                  onChange={(e) =>
                    setTempDetails({
                      ...tempDetails,
                      completedOn: e.target.value || null,
                    })
                  }
                  className="w-32 text-black"
                />
              </label>
            </div>
          </div>
          <div className="w-full sm:w-1/2 mb-2">
            <div className="mx-2 mb-2">
              <label className="flex justify-between">
                Rating:
                <select
                  name="rating"
                  id=""
                  onChange={(e) =>
                    setTempDetails({
                      ...tempDetails,
                      userScore: +e.target.value,
                    })
                  }
                  hidden={hideInput.current}
                  className="bg-white pl-2 text-center text-black"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </label>
            </div>
          </div>
          <div className="w-full sm:w-1/2 mb-2">
            <div className="mx-2 mb-2">
              <label className="flex justify-between">
                Rewatch:
                <input
                  className="w-12 pl-1 text-center text-black"
                  hidden={hideInput.current}
                  type="number"
                  name="rewatch"
                  id=""
                />
              </label>
            </div>
          </div>
          <textarea
            className="w-full mb-4 mx-2 p-2 text-black"
            name="notes"
            disabled={hideInput.current}
            id=""
            rows={4}
          ></textarea>
        </div>
      </form>
      {modalData ? (
        <>
          <div className="flex w-full flex-wrap justify-evenly items-center dark:text-black">
            <button
              className="border rounded border-neutral-800 dark:border-stone-400 bg-lime-500 p-1 m-1 w-24"
              onClick={() => statusOnClick("WATCHING")}
            >
              Watching
            </button>
            <button
              className="border rounded border-neutral-800 dark:border-stone-400 bg-indigo-400 p-1 m-1 w-24"
              onClick={() => statusOnClick("INTERESTED")}
            >
              Interested
            </button>
            <button
              className="border rounded border-neutral-800 dark:border-stone-400 bg-blue-400 p-1 m-1 w-24"
              onClick={() => statusOnClick("COMPLETED")}
            >
              Completed
            </button>
            <button
              className="border rounded border-neutral-800 dark:border-stone-400 bg-red-500 p-1 m-1 w-24"
              onClick={() => statusOnClick("DROPPED")}
            >
              Dropped
            </button>
            <button
              className="border rounded border-neutral-800 dark:border-stone-400 bg-amber-600 p-1 m-1 w-24"
              onClick={() => statusOnClick("SKIPPED")}
            >
              Skipped
            </button>
          </div>
          <button
            className="border rounded border-slate-950 dark:border-stone-400 bg-rose-700 w-20 p-1 mt-4"
            onClick={() => {
              if (!tempDetails || !tempStatus || tempDetails.id === null)
                return;
              unsavedChanges.current = false;
              setUnsavedNotification(null);
              dispatch({
                type: "UPDATE_PREFERENCE",
                payload: { status: tempStatus, cardData: tempDetails },
              });
            }}
          >
            Save
          </button>
        </>
      ) : null}
    </div>
  );
};
export default CardListOptions;
