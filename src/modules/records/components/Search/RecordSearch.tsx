import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { Paginator } from "src/modules/common/components/Paginator";
import type { PaginateResult } from "src/modules/common/dto/paginate-result.dto";
import ErrorAlert from "src/modules/common/ErrorAlert/ErrorAlert";
import useFetch from "src/modules/common/hooks/useFetch";
import { User } from "src/modules/users/models/user.model";
import { UserService } from "src/modules/users/services/user.service";
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
          <strong>Автор:</strong>{" "}
          <Link to={`/profile/${record.author.username ?? record.author._id}`}>
            {record.author.username ?? record.author._id}
          </Link>
        </ListGroup.Item>
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<PaginateResult<Record> | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  const authorId = useMemo(() => searchParams.get("author"), [searchParams]);
  const [user, setUser] = useState<User | null>(null);

  const { fetch, isFetching, error } = useFetch(() =>
    RecordsService.findAll({
      page,
      limit,
      pagination: true,
      search: searchQuery || undefined,
      author: authorId || undefined,
    }).then((res) => {
      if (!res) return;
      setData(res);
      setTotalPages(res.totalPages);
    }),
  );

  useEffect(() => {
    fetch();
    if (authorId) {
      UserService.findOne(authorId).then((res) => setUser(res));
    }
  }, [page, authorId]);

  return (
    <Container className="mt-2">
      <h4>Поиск мест</h4>
      <Form
        className="mb-2"
        onSubmit={(e) => {
          e.preventDefault();
          fetch();
        }}
      >
        <InputGroup>
          <FormControl
            id="searchQuery"
            placeholder="Поиск по названию и адресу"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <LoadingButton isLoading={isFetching} type="submit">
            Поиск
          </LoadingButton>
        </InputGroup>
      </Form>
      {authorId && (
        <Alert>
          Показаны места, созданные пользователем{" "}
          <a href={"profile/" + authorId}>
            {user?.username || authorId}
            {user?.name && ` (${user.name})`}
          </a>{" "}
          <Button
            size="sm"
            onClick={() => {
              searchParams.delete("author");
              setSearchParams(searchParams);
            }}
          >
            Сбросить
          </Button>
        </Alert>
      )}
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
