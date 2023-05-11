import {
  FunctionComponent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { ListDetails, UserShowStatus } from "../../interfaces/UserPreferences";
import { formattedDate } from "../../utilities/Cards/FormattedCardTexts";

import { useDispatchContext } from "../../utilities/Context/AppContext";

const CardListOptions: FunctionComponent<{
  modalData: MainCard | undefined;
  unsavedChanges: MutableRefObject<boolean>;
  previous: [UserShowStatus, ListDetails] | undefined;
}> = ({ modalData, unsavedChanges, previous }) => {
  if (!modalData) return <></>;
  const [prevStatus, prevDetails] = previous || [undefined, undefined];
  const dispatch = useDispatchContext();
  const hideInput = useRef(previous ? false : true);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [unsavedNotification, setUnsavedNotification] =
    useState<JSX.Element | null>(null);
  const [tempStatus, setTempStatus] = useState<UserShowStatus | undefined>(
    prevStatus
  );

  // UNDEFINED VALUES ARE NOT GETTING SAVED WHEN STRINGIFIED BY JSON OBJ????? WTF

  const [tempDetails, setTempDetails] = useState<ListDetails>(
    prevDetails || {
      id: modalData.id,
      season: modalData.season,
      year: modalData.seasonYear,
      title: modalData.title,
      showAiringStatus: modalData.status,
      currentEpisode: 0,
      userScore: 0,
      rewatches: 0,
      startedOn: "",
      completedOn: "",
      notes: "",
    }
  );

  const statusOnClick = (status: UserShowStatus) => {
    setTempStatus(status);
    hideInput.current = false;
  };

  function isPrevDetailsMismatch() {
    if (!prevDetails) return;
    const a = Object.entries(tempDetails);
    const b = Object.entries(prevDetails);
    const mismatch = a.some(([, val], i) => b[i][1] !== val);
    return mismatch;
  }

  function isPrevStatusMismatch() {
    return tempStatus !== undefined && tempStatus !== prevStatus;
  }

  useEffect(() => {
    //is tempStatus changes from the previousDetails[0] value OR if a value of tempDetails !== similar value of same key in previousDetails[1]: UNSAVED_CHANGES = true
    if (isPrevStatusMismatch() || isPrevDetailsMismatch()) {
      unsavedChanges.current = true;
      setUnsavedNotification(
        <div className="text-stone-200 bg-red-950 w-max px-2 py-1 text-center border border-red-400 rounded">
          <p>You have unsaved changes</p>
        </div>
      );
    } else {
      unsavedChanges.current = false;
    }
    return () => {
      unsavedChanges.current = false;
      setUnsavedNotification(null);
    };
  }, [tempStatus, tempDetails]);

  return (
    <div className="dark:text-stone-300 p-2">
      <h2 className="font-bold text-2xl text-center">List Editor</h2>
      <hr className="border-slate-950 dark:border-stone-400 border-1 mb-2" />
      <h3 className="font-semibold text-xl text-center">
        {modalData.title.english || modalData.title.romaji}
      </h3>
      <hr className="border-slate-950 dark:border-stone-400 border-2" />
      <form
        ref={formRef}
        className="flex flex-col items-center"
        // onChange={(e) => {
        //   const target = e.target as
        //     | HTMLInputElement
        //     | HTMLSelectElement
        //     | HTMLTextAreaElement;
        //   setTempDetails({ ...tempDetails, [target.name]: target.value });
        // }}
      >
        <h4 className="text-center font-medium">Show Status</h4>
        {unsavedNotification}
        <div className="flex w-full flex-col flex-wrap sm:flex-row mb-2">
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
                  disabled={
                    modalData.status === "NOT_YET_RELEASED" ||
                    tempStatus === "INTERESTED" ||
                    tempStatus === "SKIPPED"
                  }
                  type="number"
                  name="currentEpisode"
                  min={0}
                  max={
                    (modalData.nextAiringEpisode?.episode &&
                      modalData.nextAiringEpisode.episode - 1) ||
                    modalData.episodes
                  }
                  onChange={(e) => {
                    setTempDetails({
                      ...tempDetails,
                      currentEpisode: +e.target.value,
                    });
                  }}
                  value={tempDetails.currentEpisode}
                />
              </label>
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="mx-2 mb-2">
              <label className="flex justify-between w-full">
                Started:
                <div>
                  <input
                    className="w-32 text-black"
                    type="date"
                    hidden={hideInput.current}
                    disabled={
                      hideInput.current ||
                      modalData.status === "NOT_YET_RELEASED" ||
                      tempStatus === "SKIPPED" ||
                      tempStatus === "INTERESTED"
                    }
                    name="startedOn"
                    value={tempDetails.startedOn}
                    onChange={(e) =>
                      setTempDetails({
                        ...tempDetails,
                        startedOn: e.target.value,
                      })
                    }
                  />
                  <button
                    className="border rounded px-1 ml-1 bg-slate-300 text-black disabled:bg-slate-600 disabled:text-slate-800"
                    title="Set the calendar date corresponding to this show's premier date."
                    onClick={(e) => {
                      e.preventDefault();
                      const input = formRef.current?.elements.namedItem(
                        "startedOn"
                      ) as HTMLInputElement;

                      const cleanDate = formattedDate(
                        modalData.startDate,
                        modalData.season,
                        true
                      );
                      tempDetails.startedOn === cleanDate
                        ? null
                        : setTempDetails({
                            ...tempDetails,
                            startedOn: cleanDate,
                          });
                      input.value = cleanDate;
                    }}
                    hidden={hideInput.current}
                    disabled={
                      hideInput.current ||
                      modalData.status === "NOT_YET_RELEASED" ||
                      tempStatus === "SKIPPED" ||
                      tempStatus === "INTERESTED"
                    }
                  >
                    Set
                  </button>
                </div>
              </label>
            </div>
            <div className="mx-2 mb-2">
              <label className="flex justify-between w-full">
                Completed:
                <div>
                  <input
                    className="w-32 text-black"
                    type="date"
                    hidden={hideInput.current}
                    disabled={
                      tempStatus === "SKIPPED" ||
                      tempStatus === "INTERESTED" ||
                      tempStatus === "WATCHING" ||
                      hideInput.current
                    }
                    name="completedOn"
                    value={tempDetails.completedOn}
                    onChange={(e) =>
                      setTempDetails({
                        ...tempDetails,
                        completedOn: e.target.value,
                      })
                    }
                  />
                  <button
                    className="border rounded px-1 ml-1 bg-slate-300 text-black disabled:bg-slate-600 disabled:text-slate-800"
                    title="Set the calendar date corresponding to this show's ending date."
                    onClick={(e) => {
                      e.preventDefault();
                      const input = formRef.current?.elements.namedItem(
                        "completedOn"
                      ) as HTMLInputElement;

                      const cleanDate =
                        modalData.status === "FINISHED"
                          ? formattedDate(
                              modalData.endDate as {
                                day: number;
                                month: number;
                                year: number;
                              },
                              modalData.season,
                              true
                            )
                          : "";
                      tempDetails.completedOn === cleanDate
                        ? null
                        : setTempDetails({
                            ...tempDetails,
                            completedOn: cleanDate,
                          });
                      input.value = cleanDate;
                    }}
                    hidden={hideInput.current}
                    disabled={
                      hideInput.current ||
                      modalData.status !== "FINISHED" ||
                      tempStatus === "SKIPPED" ||
                      tempStatus === "INTERESTED" ||
                      tempStatus === "WATCHING"
                    }
                  >
                    Set
                  </button>
                </div>
              </label>
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="mx-2 mb-2">
              <label className="flex justify-between">
                Rating:
                <select
                  className="bg-white pl-2 text-center text-black disabled:bg-gray-400"
                  disabled={
                    modalData.status === "NOT_YET_RELEASED" ||
                    tempStatus === "INTERESTED" ||
                    tempStatus === "SKIPPED"
                  }
                  hidden={hideInput.current}
                  value={tempDetails.userScore}
                  onChange={(e) =>
                    setTempDetails({
                      ...tempDetails,
                      userScore: +e.target.value,
                    })
                  }
                  name="userScore"
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
                  disabled={
                    modalData.status === "NOT_YET_RELEASED" ||
                    tempStatus !== "COMPLETED"
                  }
                  type="number"
                  name="rewatches"
                  value={tempDetails.rewatches}
                  onChange={(e) =>
                    setTempDetails({
                      ...tempDetails,
                      rewatches: +e.target.value,
                    })
                  }
                  min={0}
                />
              </label>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <textarea
              className="w-11/12 text-black p-2"
              name="notes"
              disabled={hideInput.current}
              hidden={hideInput.current}
              value={tempDetails.notes}
              onChange={(e) =>
                setTempDetails({ ...tempDetails, notes: e.target.value })
              }
            ></textarea>
          </div>
        </div>
      </form>
      <div className="flex w-full flex-wrap justify-evenly items-center dark:text-black">
        <button
          className="border rounded border-neutral-800 dark:border-stone-400 bg-lime-500 disabled:bg-slate-400 disabled:text-gray-700 p-1 m-1 w-24"
          onClick={() => {
            if (tempStatus !== "WATCHING" && prevDetails) {
              setTempDetails({ ...prevDetails, completedOn: "" });
            }
            statusOnClick("WATCHING");
          }}
          disabled={modalData.status === "NOT_YET_RELEASED"}
        >
          Watching
        </button>
        <button
          className="border rounded border-neutral-800 dark:border-stone-400 bg-indigo-400 disabled:bg-slate-400 disabled:text-gray-700 p-1 m-1 w-24"
          onClick={() => {
            setTempDetails({
              ...tempDetails,
              currentEpisode: 0,
              completedOn: "",
              startedOn: "",
              rewatches: 0,
              userScore: 0,
            });
            statusOnClick("INTERESTED");
          }}
        >
          Interested
        </button>
        <button
          className="border rounded border-neutral-800 dark:border-stone-400 bg-blue-400 disabled:bg-slate-400 disabled:text-gray-700 p-1 m-1 w-24"
          onClick={() => {
            setTempDetails({
              ...tempDetails,
              currentEpisode:
                modalData.episodes || tempDetails.currentEpisode || 0,
            });
            statusOnClick("COMPLETED");
          }}
          disabled={
            modalData.status === "NOT_YET_RELEASED" ||
            modalData.status === "RELEASING"
          }
        >
          Completed
        </button>
        <button
          className="border rounded border-neutral-800 dark:border-stone-400 bg-red-500 disabled:bg-slate-400 disabled:text-gray-700 p-1 m-1 w-24"
          onClick={() => statusOnClick("DROPPED")}
          disabled={modalData.status === "NOT_YET_RELEASED"}
        >
          Dropped
        </button>
        <button
          className="border rounded border-neutral-800 dark:border-stone-400 bg-amber-600 disabled:bg-slate-400 disabled:text-gray-700 p-1 m-1 w-24"
          onClick={() => statusOnClick("SKIPPED")}
          disabled={modalData.status === "NOT_YET_RELEASED"}
        >
          Skipped
        </button>
      </div>
      <button
        className="border rounded border-slate-950 dark:border-stone-400 bg-rose-700 w-20 p-1 mt-4"
        onClick={() => {
          if (!tempDetails || !tempStatus || tempDetails.id === null) return;
          unsavedChanges.current = false;
          setUnsavedNotification(null);

          dispatch({
            type: "UPDATE_PREFERENCE",
            payload: {
              status: tempStatus,
              cardData: tempDetails,
            },
          });
        }}
      >
        Save
      </button>
    </div>
  );
};
export default CardListOptions;
