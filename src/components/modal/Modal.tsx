import { FunctionComponent, useEffect } from "react";
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

  return (
    <div className="w-96 h-64 p-3 absolute bg-slate-200 left-0 right-0 mx-auto z-30">
      {modalData !== null ? (
        <>
          <h4>{modalData.title.romaji}</h4>bru
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
