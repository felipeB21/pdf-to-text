import { useEffect, useState } from "react";
import { Data } from "../types";

export const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState<Data>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);
  return (
    <div>
      <article>{data.toString()}</article>
    </div>
  );
};
