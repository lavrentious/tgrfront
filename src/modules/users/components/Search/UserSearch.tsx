import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
  Row,
} from "react-bootstrap";
import { BsXLg as CancelIcon } from "react-icons/bs";
import { Link } from "react-router-dom";
import { formatApiError } from "src/api/utils";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { Paginator } from "src/modules/common/components/Paginator";
import ErrorAlert from "src/modules/common/ErrorAlert/ErrorAlert";
import { useDebounce } from "use-debounce";
import { useGetUsersQuery } from "../../api/users.api";
import { User } from "../../models/user.model";
import RoleBadge from "../Profile/RoleBadge";

const UserData: React.FC<{ doc: User }> = ({ doc: user }) => {
  return (
    <ListGroup.Item>
      <Link to={`/profile/${user.username ?? user._id}`}>
        <RoleBadge role={user.role} small className="me-2" />
        {user.username || user._id} {user.name && <>({user.name})</>}
      </Link>
    </ListGroup.Item>
  );
};

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  const { data, error, isError, isFetching } = useGetUsersQuery({
    pagination: true,
    limit,
    page,
    search: debouncedSearchQuery,
  });

  return (
    <Container className="mt-2">
      <h4>Поиск пользователей</h4>
      <Row>
        <Col lg={6}>
          <Form className="mb-2">
            <InputGroup>
              <FormControl
                id="searchQuery"
                placeholder="Поиск по логину и имени"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                readOnly={isFetching}
              />
              <LoadingButton
                variant="secondary"
                disabled={debouncedSearchQuery === ""}
                isLoading={isFetching}
                icon={<CancelIcon />}
                onClick={() => setSearchQuery("")}
              />
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <Paginator
        page={page}
        limit={limit}
        totalPages={data?.totalPages ?? 1}
        setPage={setPage}
        totalCount={data?.totalDocs}
      />

      {isError && <ErrorAlert>{formatApiError(error)}</ErrorAlert>}

      {data?.docs?.length != null && (
        <>
          <ListGroup>
            {data.docs.map((doc) => (
              <UserData doc={doc} key={doc._id} />
            ))}
          </ListGroup>
        </>
      )}
    </Container>
  );
};

export default UserSearch;
