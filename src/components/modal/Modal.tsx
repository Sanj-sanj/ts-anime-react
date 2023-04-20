import { FunctionComponent, useEffect, useState } from "react";
import useFocusEffect from "../../utilities/Focus/FocusUtil";
import CardDetailsModal from "./CardDetailsModal";
import CardListOptions from "./CardListOptions";

const Modal: FunctionComponent<{
  closeModal: () => void;
}> = ({ closeModal }) => {
  const [childComponent, setChildComponent] = useState<null | JSX.Element>(
    null
  );
  const modal = document.querySelector("#modalRoot") as HTMLDivElement;

  useEffect(() => {
    modal.classList.replace("hidden", "flex");
    return () => {
      modal.classList.replace("flex", "hidden");
    };
  });
  useFocusEffect(modal, closeModal);

  return (
    <div className="w-4/5 md:w-4/6 xl:w-2/4 min-h-[16rem] p-3 absolute bg-slate-200 dark:bg-slate-800 left-0 right-0 mx-auto z-40 rounded">
      {childComponent}
      {childComponent ? null : (
        <>
          <button onClick={() => setChildComponent(<CardDetailsModal />)}>
            Details
          </button>
          <button onClick={() => setChildComponent(<CardListOptions />)}>
            My list
          </button>
        </>
      )}
      <button onClick={closeModal}>close me</button>
    </div>
  );
};
export default Modal;
