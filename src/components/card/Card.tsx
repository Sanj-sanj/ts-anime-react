import { FunctionComponent } from "react";
import { CoverImage } from "../../interfaces/apiResponseTypes";

type CardProps = {
  title: string;
  season: string | null;
  coverImage: CoverImage;
  type: string | null;
  meanScore: number | null;
};
const Card: FunctionComponent<CardProps> = ({
  title,
  season,
  coverImage,
  type,
  meanScore,
}) => {
  return (
    <div
      className="flex m-2 py-1 border border-slate-800"
      style={{ backgroundColor: coverImage.color || "#4282" }}
    >
      <img src={coverImage.medium || "not founds"} alt={title} />
      <h1>{title}</h1>
      <p>{season}</p>
      <p>{type}</p>
      <p>{meanScore}</p>
    </div>
  );
};
export default Card;
