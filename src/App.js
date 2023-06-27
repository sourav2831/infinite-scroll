import { useState, useRef } from "react";
import InfiniteScroll from "./InfiniteScroll";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const controllerRef = useRef(null);

  const getData = async (query, pageNumber) => {
    if (!query || !pageNumber) return;
    try {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();
      const response = await fetch(
        "https://openlibrary.org/search.json?" +
          new URLSearchParams({
            q: query,
            page: pageNumber,
          }),
        { signal: controllerRef.current.signal }
      );
      const searchData = await response.json();
      setData((prev) => [...prev, ...searchData.docs]);
    } catch (e) {
      console.log(e);
    }
  };

  const renderListItem = ({ title, key }, ref) => (
    <div key={key} ref={ref}>
      {title}
    </div>
  );

  return (
    <div className="App">
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <InfiniteScroll
        renderListItem={renderListItem}
        query={query}
        data={data}
        getData={getData}
        setData={setData}
      />
    </div>
  );
}

export default App;
