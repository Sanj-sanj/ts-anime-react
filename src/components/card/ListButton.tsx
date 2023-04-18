import { FunctionComponent, useRef } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { useDispatchContext } from "../../utilities/Context/AppContext";

const ListButton: FunctionComponent<{
  card: MainCard;
  focusHandler: (ref: HTMLButtonElement) => void;
}> = ({ card, focusHandler }) => {
  const dispatch = useDispatchContext();
  const buttonRef = useRef<null | HTMLButtonElement>(null);
  return (
    <button
      className="absolute -right-3 -top-3 z-30 bg-red-700 rounded-lg focus:outline outline-blue-400"
      ref={buttonRef}
      onClick={() => {
        dispatch({
          type: "TOGGLE_MODAL",
          payload: { action: "OPEN", data: card },
        });
      }}
      onFocus={() => focusHandler(buttonRef.current as HTMLButtonElement)}
    >
      W.I.P
    </button>
  );
};
export default ListButton;
