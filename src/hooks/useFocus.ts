import { useRef } from "react";
import { ClientVariables } from "../interfaces/initialConfigTypes";

export default function useFocus(client: ClientVariables) {
  const lastFocusedElement = useRef<null | HTMLButtonElement>(null);
    
  if (
    lastFocusedElement.current !== null &&
    client.overlay.modal.active === false
  )
    lastFocusedElement.current.focus();

    return {lastFocusedElement}
}
