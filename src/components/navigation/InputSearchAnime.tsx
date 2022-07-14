import { MutableRefObject } from "react";

const InputSearchAnime = ({
  inputRef,
}: {
  inputRef: MutableRefObject<HTMLInputElement | null>;
}) => {
  //to-do: link submit to an anilist graphql schema
  //to-do: type ahead
  return (
    <form action="#">
      <label htmlFor="search-anime">
        <input type="search" id="search-anime" ref={inputRef} />
      </label>
    </form>
  );
};

export default InputSearchAnime;
