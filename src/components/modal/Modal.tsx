import { FunctionComponent, useEffect } from "react";
import {
  NextAiringEpisode,
  ShowStatus,
} from "../../interfaces/apiResponseTypes";
import { useStateContext } from "../../utilities/Context/AppContext";

const Modal: FunctionComponent<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const {
    client: { modalData },
  } = useStateContext();
  let index = 0;

  useEffect(() => {
    const focusables =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.querySelector("#modalRoot") as HTMLDivElement;
    const focusEls: NodeListOf<HTMLElement> =
      modal.querySelectorAll(focusables);
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
      if (e.key === "Tab" || (e.shiftKey && e.key === "Tab")) {
        e.preventDefault();
        e.shiftKey ? index-- : index++;
        if (index >= focusEls.length) index = 0;
        if (index < 0) index = focusEls.length - 1;
        focusEls[index].focus();
      }
    };

    focusEls[0].focus();
    document.addEventListener("keydown", keyListener);
    return () => document.removeEventListener("keydown", keyListener);
  });

  function buildCountdownBar(
    status: ShowStatus,
    nextAiringEpisode: NextAiringEpisode
  ) {
    let faultyStatus = ["FINISHED", "CANCELED", "HIATUS"].find(
      (e) => e === status
    );
    if (nextAiringEpisode === null && status === "RELEASING") {
      faultyStatus = "NO INFO";
    }
    return (
      <div className="bg-sky-600 dark:bg-sky-800 text-center">
        {faultyStatus ? faultyStatus : status}
      </div>
    );
  }

  return (
    <div className="w-4/5 md:w-4/6 xl:w-2/4 min-h-[16rem] p-3 absolute bg-slate-200 dark:bg-slate-800 left-0 right-0 mx-auto z-30 rounded">
      {modalData !== null ? (
        <>
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <img
              className="pr-4 w-min"
              src={modalData.coverImage.large || ""}
              alt={modalData.title.romaji || ""}
            />
            <div className="w-full">
              <div className="flex justify-between dark:text-slate-300">
                <h4 className="font-semibold text-2xl pr-2">
                  {modalData.title.romaji}
                </h4>
                <div>
                  <p>
                    <span className="font-semibold">Rating:</span>{" "}
                    {modalData.meanScore}/100
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {modalData.status}
                  </p>
                </div>
              </div>
              {buildCountdownBar(modalData.status, modalData.nextAiringEpisode)}
            </div>
          </div>
          <input type="search" name="" id="" />
          <button>test</button>
          <input type="search" name="" id="" />
        </>
      ) : (
        <></>
      )}
      <button onClick={closeModal}>close me</button>
    </div>
  );
};
export default Modal;
