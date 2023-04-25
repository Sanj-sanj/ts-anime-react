import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useStateContext } from "../../utilities/Context/AppContext";

import useFocusEffect from "../../utilities/Focus/FocusUtil";
import CardDetailsModal from "./CardDetailsModal";
import CardListOptions from "./CardListOptions";

const ModalButton: FunctionComponent<{ text: string; onClick: () => void }> = ({
  text,
  onClick,
}) => (
  <button
    className="border rounded bg-stone-400 dark:bg-slate-700 p-1 mb-2"
    onClick={onClick}
  >
    {text}
  </button>
);

const Modal: FunctionComponent<{
  closeModal: () => void;
}> = ({ closeModal }) => {
  const {
    client: { modalData },
  } = useStateContext();

  const [childComponent, setChildComponent] = useState<null | JSX.Element>(
    null
  );
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
    <div className="flex flex-col w-4/5 md:w-4/6 xl:w-2/4 min-h-[16rem] p-3 absolute bg-slate-200 dark:bg-slate-800 left-0 right-0 mx-auto z-40 rounded">
      <div className="w-full flex justify-between">
        <ModalButton text="Close Me" onClick={closeModal} />
        {childComponent ? (
          <ModalButton text="Go Back" onClick={() => setChildComponent(null)} />
        ) : null}
      </div>
      {childComponent ? null : (
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
                />
              );
            }}
          />
        </div>
      )}
      {childComponent}
    </div>
  );
};
export default Modal;
