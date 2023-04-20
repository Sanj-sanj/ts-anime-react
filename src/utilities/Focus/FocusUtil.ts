import { useEffect } from "react";

export default function useFocusEffect(
  container: HTMLElement | null,
  closeModal: () => void
) {
  let index = 0;

  const modalKeyListener = (
    e: KeyboardEvent,
    focusEls: NodeListOf<HTMLElement>
  ) => {
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

  useEffect(() => {
    if (!container || container.hidden) return;
    const focusables =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusEls: NodeListOf<HTMLElement> =
      container.querySelectorAll(focusables);

    const keyListener = (e: KeyboardEvent) => {
      modalKeyListener(e, focusEls);
    };

    focusEls[0].focus();
    document.addEventListener("keydown", keyListener);
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  });
}
