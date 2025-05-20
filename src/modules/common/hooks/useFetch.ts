import { useState } from "react";
import type { ApiError } from "../api";

function useFetch<T = unknown, E = ApiError>(
  callback: (...args: unknown[]) => Promise<T>,
) {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<E | null>(null);
  const fetch: () => Promise<T | void> = async () => {
    setIsFetching(true);
    return callback()
      .catch(setError)
      .finally(() => {
        setIsFetching(false);
      });
  };
  return { fetch, isFetching, error, setError };
}

export default useFetch;
