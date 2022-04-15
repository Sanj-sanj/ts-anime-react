import { FunctionComponent } from "react";
import { Titles } from "../../interfaces/apiResponseTypes";

type Data = {
  title: Titles;
  desc: string | null;
  cover: string | null;
};
const Card: FunctionComponent<Data> = (props) => {
  const { title, desc, cover } = props;
  return (
    <div>
      <h1>{title.english || title.romaji || title.native || "not found"}</h1>
      <img
        src={cover || "not founds"}
        alt={title.english || title.romaji || title.native || "not found"}
      />
      <p>{desc}</p>
    </div>
  );
};
export default Card;
