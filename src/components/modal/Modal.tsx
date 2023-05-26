import { FunctionComponent, useEffect, useRef, useState } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { ModalEntryPoint } from "../../interfaces/initialConfigTypes";
import {
  ListDetails,
  ShowListDetails,
  UserShowStatus,
} from "../../interfaces/UserPreferencesTypes";

import { useStateContext } from "../../utilities/Context/AppContext";
import useFocusEffect from "../../utilities/Focus/FocusUtil";
import CardDetailsModal from "./CardDetailsModal";
import CardListOptions from "./CardListOptions";
import NewEpisodeModal from "./NewEpisodesModal";

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
    user: { lists, modalData, newEpisodesAvailable },
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
  const airingEpisodesDetails: ShowListDetails<number> = {};
  let previousStatusDetailsForCardEntryPoint:
    | [UserShowStatus, ListDetails]
    | undefined;

  if (entryPoint === "card" && modalData) {
    const inList: [UserShowStatus, ShowListDetails<number>] | undefined =
      prefArray.find(([, details]) => {
        return modalData.id in details;
      });
    previousStatusDetailsForCardEntryPoint = inList
      ? [inList[0], inList[1][modalData.id]]
      : undefined;
  } else if (entryPoint === "new release" && newEpisodesAvailable) {
    newEpisodesAvailable.forEach((card) => {
      airingEpisodesDetails[card.id] = lists.WATCHING[card.id];
    });
  }

  return (
    <div className="flex flex-col w-11/12 md:w-5/6 lg:w-4/6 xl:w-2/4 max-h-[85%] absolute bg-slate-200 dark:bg-slate-800 left-0 right-0 mx-auto my-4 z-40 rounded-md">
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
                  details={previousStatusDetailsForCardEntryPoint}
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
                  previous={previousStatusDetailsForCardEntryPoint}
                />
              );
            }}
          />
        </div>
      ) : entryPoint === "new release" ? (
        <NewEpisodeModal
          modalData={newEpisodesAvailable}
          singelShowDetails={airingEpisodesDetails}
        />
      ) : null}

      {childComponent}
    </div>
  );
};
export default Modal;
