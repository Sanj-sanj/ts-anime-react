import { FunctionComponent, useEffect, useRef, useState } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { ModalEntryPoint } from "../../interfaces/initialConfigTypes";
import {
  ListDetails,
  ShowListDetails,
  UserShowStatus,
} from "../../interfaces/UserPreferences";
import {
  isMainCard,
  isNewEpisodeCards,
} from "../../utilities/Cards/CheckCardType";
import { useStateContext } from "../../utilities/Context/AppContext";

import useFocusEffect from "../../utilities/Focus/FocusUtil";
import CardDetailsModal from "./CardDetailsModal";
import CardListOptions from "./CardListOptions";

const ModalButton: FunctionComponent<{ text: string; onClick: () => void }> = ({
  text,
  onClick,
}) => (
  <button
    className="border rounded bg-stone-400 dark:bg-slate-400 p-1"
    onClick={onClick}
  >
    {text}
  </button>
);

const Modal: FunctionComponent<{
  closeModal: () => void;
  entryPoint: ModalEntryPoint;
}> = ({ closeModal, entryPoint }) => {
  const {
    client: { modalData },
    user: { lists },
  } = useStateContext();
  const unsavedChanges = useRef<boolean>(false);
  const modal = document.querySelector("#modalRoot") as HTMLDivElement;
  const [childComponent, setChildComponent] = useState<null | JSX.Element>(
    null
  );

  useEffect(() => {
    modal.classList.replace("hidden", "flex");
    return () => {
      modal.classList.replace("flex", "hidden");
    };
  });
  useFocusEffect(modal, closeModal, unsavedChanges);

  const prefArray = Object.entries(lists) as [
    UserShowStatus,
    ShowListDetails<number>
  ][];

  let inList: [UserShowStatus, ShowListDetails<number>] | undefined;
  let previousStatusDetails: [UserShowStatus, ListDetails] | undefined;
  if (modalData && !Array.isArray(modalData) && isMainCard([modalData])) {
    inList = prefArray.find(([, details]) => {
      return modalData.id in details;
    });
    previousStatusDetails = inList
      ? [inList[0], inList[1][modalData.id]]
      : undefined;
  }

  return (
    <div className="flex flex-col w-4/5 md:w-4/6 xl:w-2/4 min-h-[16rem] max-h-[85%] absolute bg-slate-200 dark:bg-slate-800 left-0 right-0 mx-auto my-4 z-40 rounded-md">
      <div className="w-full flex justify-between bg-slate-600 p-2 items-center rounded-t">
        <ModalButton text="Close Me" onClick={closeModal} />
        {entryPoint === "card" && childComponent ? (
          <ModalButton text="Go Back" onClick={() => setChildComponent(null)} />
        ) : null}
      </div>
      {entryPoint === "card" && !childComponent ? (
        <div className="w-full min-h-fit contents">
          <ModalButton
            text="Details"
            onClick={() =>
              setChildComponent(
                <CardDetailsModal
                  modalData={modalData as MainCard}
                  details={previousStatusDetails}
                />
              )
            }
          />
          <ModalButton
            text="List Options"
            onClick={() => {
              setChildComponent(
                <CardListOptions
                  modalData={modalData as MainCard}
                  unsavedChanges={unsavedChanges}
                  previous={previousStatusDetails}
                />
              );
            }}
          />
        </div>
      ) : entryPoint === "new release" &&
        Array.isArray(modalData) &&
        isNewEpisodeCards(modalData) ? (
        modalData.map((data) => (
          <div key={data.id}>{data.title.romaji || data.title.english}</div>
        ))
      ) : null}

      {childComponent}
    </div>
  );
};
export default Modal;
