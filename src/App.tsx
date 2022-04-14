import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Card from "./components/card/Card";
import request from "./utilities/requestAnime";
import { mainCard } from "./interfaces/apiResponseTypes";

const App = () => {
  const [info, setInfo] = useState([] as mainCard[]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    Promise.resolve(request())
      .then((v) => setInfo(v))
      .catch((err) => console.log("Something went wrong", err));
    setIsFetching(false);
  }, []);

  return (
    <div>
      supper doodles
      <div className="">
        {/* <button onClick={async () => setInfo(await request())}> adkasd</button> */}
        {info && !isFetching
          ? info.map((data) => (
              <Card
                key={data.id}
                title={data.title.english}
                desc={data.season}
                cover={data.coverImage.medium}
              />
            ))
          : null}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
