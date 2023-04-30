import { FunctionComponent, useEffect, useRef, useState } from "react";
import { ModalEntryPoint } from "../../interfaces/initialConfigTypes";
import {
  ListDetails,
  ShowListDetails,
  UserShowStatus,
} from "../../interfaces/UserPreferences";
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

  const [childComponent, setChildComponent] = useState<null | JSX.Element>(
    null
  );

  const prefArray = Object.entries(lists) as [
    UserShowStatus,
    ShowListDetails<number>
  ][];

  let inList: [UserShowStatus, ShowListDetails<number>] | undefined;
  if (modalData?.id) {
    inList = prefArray.find(([, details]) => {
      return modalData.id in details;
    });
  }
  const previousStatusDetails: [UserShowStatus, ListDetails] | undefined =
    inList ? [inList[0], inList[1][modalData?.id as number]] : undefined;

  const unsavedChanges = useRef<boolean>(false);
  const modal = document.querySelector("#modalRoot") as HTMLDivElement;

  useEffect(() => {
    modal.classList.replace("hidden", "flex");
    return () => {
      modal.classList.replace("flex", "hidden");
    };
  });
  useFocusEffect(modal, closeModal, unsavedChanges);

  return (
    <div className="flex flex-col w-4/5 md:w-4/6 xl:w-2/4 min-h-[16rem] max-h-[85%] absolute bg-slate-200 dark:bg-slate-800 left-0 right-0 mx-auto my-4 z-40 rounded-md">
      <div className="w-full flex justify-between bg-slate-600 p-2 items-center rounded-t">
        <ModalButton text="Close Me" onClick={closeModal} />
        {childComponent ? (
          <ModalButton text="Go Back" onClick={() => setChildComponent(null)} />
        ) : null}
      </div>
      {entryPoint === "card" && !childComponent ? (
        <div>
          <ModalButton
            text="Details"
            onClick={() =>
              setChildComponent(<CardDetailsModal modalData={modalData} />)
            }
          />
          <ModalButton
            text="List Options"
            onClick={() => {
              setChildComponent(
                <CardListOptions
                  modalData={modalData}
                  unsavedChanges={unsavedChanges}
                  previous={previousStatusDetails}
                />
              );
            }}
          />
        </div>
      ) : null}

      {childComponent}
    </div>
  );
};
export default Modal;
