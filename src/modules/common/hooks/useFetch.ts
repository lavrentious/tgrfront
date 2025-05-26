import type { AxiosError } from "axios";
import { useState } from "react";

function useFetch<T = unknown, E = AxiosError>(
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
