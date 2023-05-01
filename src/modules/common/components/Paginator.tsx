import React, { useEffect } from "react";
import { Pagination } from "react-bootstrap";

interface Props<T> {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  totalPages: number;
}

export function Paginator<T>({ page, limit, totalPages, setPage }: Props<T>) {
  useEffect(() => {
    if (totalPages < page) setPage(totalPages);
  }, [totalPages]);
  return (
    <Pagination>
      <Pagination.Prev
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      />
      {Array.from(Array(totalPages).keys()).map((i) => (
        <Pagination.Item
          key={i}
          active={i + 1 === page}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      />
    </Pagination>
  );
}
