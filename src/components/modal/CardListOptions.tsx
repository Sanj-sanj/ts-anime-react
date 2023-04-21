import { FunctionComponent } from "react";
import { MainCard } from "../../interfaces/apiResponseTypes";

const CardListOptions: FunctionComponent<{ modalData: MainCard | null }> = ({
  modalData,
}) => {
  return (
    <div className="flex flex-col w-full justify-around">
      <h2 className="font-semibold text-xl">
        List Editor: {modalData?.title.english || modalData?.title.romaji}
      </h2>
      <div className="flex ">
        <button onClick={() => null}>Watching</button>
        <button onClick={() => null}>Interested</button>
        <button onClick={() => null}>Completed</button>
        <button onClick={() => null}>Dropped</button>
        <button onClick={() => null}>Skipped</button>
      </div>
    </div>
  );
};
export default CardListOptions;
