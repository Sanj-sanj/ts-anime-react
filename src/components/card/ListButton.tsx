import { FunctionComponent } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";
import { useDispatchContext } from "../../utilities/Context/AppContext";

const ListButton: FunctionComponent<{ card: MainCard }> = ({ card }) => {
  const dispatch = useDispatchContext();
  return (
    <button
      className="absolute -right-3 -top-3 z-30 bg-red-700 rounded-lg"
      onClick={() =>
        dispatch({
          type: "TOGGLE_MODAL",
          payload: { action: "OPEN", data: card },
        })
      }
    >
      W.I.P
    </button>
  );
};
export default ListButton;
