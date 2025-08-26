import { FunctionComponent, useRef } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { useDispatchContext } from "../../utilities/Context/AppContext";
import ListButtonSVG from "url:../../assets/ribbon-svgrepo-com.svg";

const ListButton: FunctionComponent<{
  card: MainCard;
  focusHandler: (ref: HTMLButtonElement) => void;
}> = ({ card, focusHandler }) => {
  const dispatch = useDispatchContext();
  const buttonRef = useRef<null | HTMLButtonElement>(null);
  return (
    <button
      className="w-6 rounded-xl focus:outline focus:outline-4 outline-blue-600 "
      ref={buttonRef}
      onClick={() => {
        dispatch({
          type: "TOGGLE_MODAL",
          payload: { action: "OPEN", data: card, entryPoint: "card" },
        });
      }}
      onFocus={() => focusHandler(buttonRef.current as HTMLButtonElement)}
      title="Show more details"
    >
      <img src={ListButtonSVG as string} alt="More Details" />
    </button>
  );
};
export default ListButton;
