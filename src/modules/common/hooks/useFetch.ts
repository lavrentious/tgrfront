import { useState } from "react";

const useFetch = (callback: (...args: unknown[]) => unknown) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);
  const fetch: () => void = async () => {
    setIsFetching(true);
    setError(null);
    try {
      await callback();
    } catch (e) {
      setError(e);
    } finally {
      setIsFetching(false);
    }
  };
  return {fetch, isFetching, error};
};

export default useFetch;
