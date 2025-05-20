import { useAbility } from "@casl/react";
import { useEffect, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { PencilFill as EditIcon } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import { AbilityContext } from "src/modules/ability/ability";
import ErrorAlert from "src/modules/common/ErrorAlert/ErrorAlert";
import useFetch from "src/modules/common/hooks/useFetch";
import { User } from "src/modules/users/models/user.model";
import { UserService } from "src/modules/users/services/user.service";
import EditProfileModal from "./EditProfileModal";
import UserData from "./UserData";

const Profile = () => {
  const { idOrUsername } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const ability = useAbility(AbilityContext);

  const { fetch, error, isFetching } = useFetch(() =>
    UserService.findOne(idOrUsername as string),
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!idOrUsername) return navigate("/");
    if (user && (idOrUsername === user._id || idOrUsername === user.username))
      return;
    fetch().then((res) => {
      if (!res) return;
      setUser(res);
      navigate(`/profile/${res.username ?? res._id}`, { replace: true });
    });
  }, [idOrUsername]);
  if (error) {
    return (
      <ErrorAlert>{error.response?.data?.message ?? error.message}</ErrorAlert>
    );
  }
  if (isFetching || !user) {
    return <Spinner animation="border" />;
  }
  const updateUser = (newUser: User) => {
    const oldUser = { ...user };
    setUser(newUser);
    if (oldUser.username !== newUser.username) {
      navigate(`/profile/${newUser.username || oldUser._id}`, {
        replace: true,
      });
    }
  };
  return (
    <>
      <EditProfileModal
        visible={editFormVisible}
        setVisible={setEditFormVisible}
        user={user}
        setUser={updateUser}
      />
      <Container className="mt-2">
        {ability.can("update", user) && (
          <Button
            variant="secondary"
            className="my-2"
            onClick={() => setEditFormVisible(true)}
          >
            <EditIcon /> Изменить профиль
          </Button>
        )}
        <UserData user={user} setUser={setUser} />
      </Container>
    </>
  );
};

export default Profile;
