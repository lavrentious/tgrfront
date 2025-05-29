import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
  Row,
} from "react-bootstrap";
import { BsXLg as CancelIcon } from "react-icons/bs";
import { Link, useSearchParams } from "react-router-dom";
import { formatApiError } from "src/api/utils";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { Paginator } from "src/modules/common/components/Paginator";
import ErrorAlert from "src/modules/common/ErrorAlert/ErrorAlert";
import { useGetUserQuery } from "src/modules/users/api/users.api";
import { useDebounce } from "use-debounce";
import { useLazyGetRecordsQuery } from "../../api/records.api";
import { Record } from "../../models/record.model";
import { SpotTypeItem } from "../RecordView/RecordData";

const RecordData: React.FC<{ doc: Record }> = ({ doc: record }) => {
  const { data: author } = useGetUserQuery(record.author._id);
  return (
    <Card className="mt-2">
      <Card.Header>
        <Link to={`/record/${record._id}`}>{record.name}</Link>
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <strong>Автор:</strong>{" "}
          <Link to={`/profile/${record.author._id}`}>
            {author?.username || record.author._id}
            {author?.name && ` (${author.name})`}
          </Link>{" "}
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

const RecordSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const authorId = useMemo(
    () => searchParams.get("author") ?? undefined,
    [searchParams],
  );

  const [
    fetchRecords,
    {
      data: recordsData,
      isFetching: isRecordsFetching,
      error: recordsError,
      isError: isRecordsError,
    },
  ] = useLazyGetRecordsQuery();

  const { data: user } = useGetUserQuery(authorId ?? "", { skip: !authorId });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, authorId]);

  useEffect(() => {
    fetchRecords({
      page,
      limit,
      pagination: true,
      search: debouncedSearchQuery || undefined,
      author: authorId,
    });
  }, [page, limit, debouncedSearchQuery, authorId, fetchRecords]);

  const clearAuthorFilter = () => {
    searchParams.delete("author");
    setSearchParams(searchParams);
    setPage(1);
  };

  return (
    <Container className="mt-2">
      <h4>Поиск мест</h4>

      <Row>
        <Col lg={6}>
          <Form className="mb-2">
            <InputGroup>
              <FormControl
                id="searchQuery"
                placeholder="Поиск по названию и адресу"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                readOnly={isRecordsFetching}
              />
              <LoadingButton
                variant="secondary"
                disabled={debouncedSearchQuery === ""}
                isLoading={isRecordsFetching}
                icon={<CancelIcon />}
                onClick={() => setSearchQuery("")}
              />
            </InputGroup>
          </Form>
        </Col>
      </Row>

      {authorId && (
        <Alert>
          Показаны места, созданные пользователем{" "}
          <Link to={`/profile/${authorId}`}>
            {user?.username || authorId}
            {user?.name && ` (${user.name})`}
          </Link>{" "}
          <Button size="sm" onClick={clearAuthorFilter}>
            Сбросить
          </Button>
        </Alert>
      )}

      <Paginator
        page={page}
        limit={limit}
        totalPages={recordsData?.totalPages ?? 1}
        setPage={setPage}
        totalCount={recordsData?.totalDocs}
      />

      {isRecordsError && (
        <ErrorAlert>{formatApiError(recordsError)}</ErrorAlert>
      )}

      {recordsData?.docs?.length != null && (
        <>
          {recordsData.docs.map((doc) => (
            <RecordData doc={doc} key={doc._id} />
          ))}
        </>
      )}
    </Container>
  );
};

export default RecordSearch;
