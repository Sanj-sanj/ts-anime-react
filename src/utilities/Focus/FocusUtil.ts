import { MutableRefObject, useEffect } from "react";

export default function useFocusEffect(
  container: HTMLElement | null,
  closeDialogue: () => void,
  unsavedChanges?: MutableRefObject<boolean>
) {
  let index = 0;
  const overlay = document.querySelector(".overlay") as HTMLButtonElement;

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

  const focusKeyListener = (
    e: KeyboardEvent,
    focusEls: NodeListOf<HTMLElement>
  ) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (unsavedChanges?.current) return;
      closeDialogue();
    }
    if (e.key === "Tab" || (e.shiftKey && e.key === "Tab")) {
      e.preventDefault();
      e.shiftKey
        ? incrementAndSkipHidden("-", focusEls)
        : incrementAndSkipHidden("+", focusEls);
      focusEls[index].focus();
    }
  };
  const focusOverlayClickListener = () => {
    if (unsavedChanges?.current) return;
    closeDialogue();
  };
  const modalFocusClickWatcher = (allEls: NodeListOf<HTMLElement>) => {
    //if user clicks on focusable element, update the index accordingly
    const entries: HTMLElement[] = [];
    allEls.forEach((el) => entries.push(el));
    index = entries.findIndex((el) => el.isSameNode(document.activeElement));
  };

  useEffect(() => {
    if (!container || container.hidden) return;
    const focusables =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusEls: NodeListOf<HTMLElement> =
      container.querySelectorAll(focusables);

    const keyListener = (e: KeyboardEvent) => {
      focusKeyListener(e, focusEls);
    };

    focusEls[0].focus();
    document.addEventListener("keydown", keyListener);
    overlay.addEventListener("click", focusOverlayClickListener);
    container.addEventListener("click", () => modalFocusClickWatcher(focusEls));
    return () => {
      document.removeEventListener("keydown", keyListener);
      overlay.removeEventListener("click", focusOverlayClickListener);
      container.removeEventListener("click", () =>
        modalFocusClickWatcher(focusEls)
      );
    };
  });
}
