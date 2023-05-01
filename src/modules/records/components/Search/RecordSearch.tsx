import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { Paginator } from "src/modules/common/components/Paginator";
import { PaginateResult } from "src/modules/common/dto/paginate-result.dto";
import ErrorAlert from "src/modules/common/ErrorAlert/ErrorAlert";
import useFetch from "src/modules/common/hooks/useFetch";
import { Record } from "../../models/record.model";
import { RecordsService } from "../../services/records.service";
import { SpotTypeItem } from "../RecordView/RecordData";

const RecordData: React.FC<{ doc: Record }> = ({ doc: record }) => {
  return (
    <Card className="mt-2">
      <Card.Header>
        <Link to={`/record/${record._id}`}>{record.name}</Link>
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <strong>Адрес:</strong> {record.address.displayName}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Тип:</strong> <SpotTypeItem type={record.type} />
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Дата создания:</strong>{" "}
          {dayjs(record.createdAt).format("LLL")}
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

const RecordSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<PaginateResult<Record> | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  const { fetch, isFetching, error } = useFetch(() =>
    RecordsService.findAll({
      page,
      limit,
      pagination: true,
      search: searchQuery || undefined,
    }).then((res) => {
      if (!res) return;
      setData(res);
      setTotalPages(res.totalPages);
    })
  );

  useEffect(() => {
    fetch();
  }, [page]);

  return (
    <Container>
      <Form
        className="my-2"
        onSubmit={(e) => {
          e.preventDefault();
          fetch();
        }}
      >
        <InputGroup>
          <FormControl
            id="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <LoadingButton isLoading={isFetching} type="submit">
            Поиск
          </LoadingButton>
        </InputGroup>
      </Form>
      <Paginator
        page={page}
        limit={limit}
        totalPages={totalPages}
        setPage={setPage}
      />
      {error && (
        <ErrorAlert>{error.response?.data.message || error.message}</ErrorAlert>
      )}
      {data?.docs?.length ? (
        <>
          <small className="text-muted">
            Показано {data.pagingCounter}-
            {Math.min(data.totalDocs, data.pagingCounter + data.limit - 1)} из{" "}
            {data.totalDocs}
          </small>
          {data.docs.map((doc) => (
            <RecordData doc={doc} key={doc._id} />
          ))}
        </>
      ) : (
        <>Нет результатов</>
      )}
    </Container>
  );
};

export default RecordSearch;
