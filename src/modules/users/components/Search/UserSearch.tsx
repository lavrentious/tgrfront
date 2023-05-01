import React, { useEffect, useState } from "react";
import {
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
import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";

const UserData: React.FC<{ doc: User }> = ({ doc: user }) => {
  return (
    <ListGroup.Item>
      {" "}
      <Link to={`/profile/${user.username ?? user._id}`}>
        {user.username || user._id} {user.name && <>({user.name})</>}
      </Link>
    </ListGroup.Item>
  );
};

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<PaginateResult<User> | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  const { fetch, isFetching, error } = useFetch(() =>
    UserService.findAll({
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
          <ListGroup>
            {data.docs.map((doc) => (
              <UserData doc={doc} key={doc._id} />
            ))}
          </ListGroup>
        </>
      ) : (
        <>Нет результатов</>
      )}
    </Container>
  );
};

export default UserSearch;
