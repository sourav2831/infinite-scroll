import { useEffect, useRef, useState } from "react";

const InfiniteScroll = ({ renderListItem, query, data, getData, setData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pageNumber = useRef(1);
  const observer = useRef(null);

  const fetchData = () => {
    setIsLoading(true);
    getData(query, pageNumber.current).finally(() => setIsLoading(false));
  };

  const lastElementObserver = (node) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        pageNumber.current += 1;
        fetchData();
      }
    });
    if (node) observer.current.observe(node);
  };

  const renderList = () => {
    return data.map((item, index) => {
      if (data.length - 1 === index)
        return renderListItem(item, lastElementObserver);
      return renderListItem(item, null);
    });
  };

  useEffect(() => {
    setData([]);
    pageNumber.current = 1;
    fetchData();
  }, [query]);

  return (
    <>
      {renderList()}
      {isLoading && "loading........"}
    </>
  );
};

export default InfiniteScroll;
