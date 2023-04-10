import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ErrorAlert from "src/modules/common/ErrorAlert/ErrorAlert";
import useFetch from "src/modules/common/hooks/useFetch";
import { User } from "src/modules/users/models/user.model";
import { UserService } from "src/modules/users/services/user.service";
import UserData from "./UserData";

const Profile = () => {
  const { idOrUsername } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const { fetch, error, isFetching } = useFetch(() =>
    UserService.findOne(idOrUsername as string)
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!idOrUsername) return navigate("/");
    fetch().then((res) => {
      if (!res) return;
      setUser(res);
      navigate(`/profile/${res.username ?? res._id}`, {replace: true});
    });
  }, []);
  if (error) {
    return (
      <ErrorAlert>{error.response?.data?.message ?? error.message}</ErrorAlert>
    );
  }
  if (isFetching || !user) {
    return <Spinner animation="border" />;
  }
  return (
    <Container className="mt-2">
      <UserData user={user} />
    </Container>
  );
};

export default Profile;
