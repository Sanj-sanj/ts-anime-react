import { FunctionComponent } from "react";

interface Data {
  title: string;
  desc: string;
  cover: string;
}
const Card: FunctionComponent<Data> = (props) => {
  const { title, desc, cover } = props;
  return (
    <div>
      <h1>{title}</h1>
      <img src={cover} alt={title} />
      <p>{desc}</p>
    </div>
  );
};
export default Card;
