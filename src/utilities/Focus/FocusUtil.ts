import { useEffect } from "react";

export default function useFocusEffect(
  container: HTMLElement | null,
  closeModal: () => void
) {
  let index = 0;

  const incrementAndSkipHidden = (
    operand: "+" | "-",
    elements: NodeListOf<HTMLElement>
  ) => {
    switch (operand) {
      case "+":
        index++;
        if (index >= elements.length) index = 0;
        break;
      case "-":
        index--;
        if (index < 0) index = elements.length - 1;
        break;
    }
    if (elements[index].hidden) {
      incrementAndSkipHidden(operand, elements);
    }
  };

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
      e.shiftKey
        ? incrementAndSkipHidden("-", focusEls)
        : incrementAndSkipHidden("+", focusEls);
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
