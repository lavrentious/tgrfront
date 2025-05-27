import { useAbility } from "@casl/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { BsPencilFill as EditIcon } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { AbilityContext } from "src/modules/ability/ability";
import LoadingPage from "src/modules/common/components/LoadingPage";
import ErrorAlert from "src/modules/common/ErrorAlert/ErrorAlert";

import { formatApiError } from "src/api/utils";
import { type IUser } from "src/modules/users/models/user.model";
import { useGetUserQuery } from "../../api/users.api";
import { createUser } from "../../utils/utils";
import EditProfileModal from "./EditProfileModal";
import UserData from "./UserData";

const Profile = () => {
  const { idOrUsername } = useParams();
  const ability = useAbility(AbilityContext);
  const navigate = useNavigate();
  const navigatedFromUpdateRef = useRef(false);

  const {
    data: user,
    error,
    isFetching,
    isError,
  } = useGetUserQuery(idOrUsername ?? "", {
    skip: !idOrUsername,
  });

  const [editFormVisible, setEditFormVisible] = useState(false);

  useEffect(() => {
    if (!idOrUsername) {
      navigate("/", { replace: true });
      return;
    }

    if (navigatedFromUpdateRef.current) {
      navigatedFromUpdateRef.current = false;
      return;
    }

    if (user && idOrUsername !== user._id && idOrUsername !== user.username) {
      navigate(`/profile/${user.username || user._id}`, { replace: true });
    }
  }, [idOrUsername, user, navigate]);

  const updateUser = useCallback(
    async (newUser: IUser) => {
      if (user?.username !== newUser.username) {
        navigatedFromUpdateRef.current = true;
        await navigate(`/profile/${newUser.username || newUser._id}`, {
          replace: true,
        });
      }
    },
    [navigate, user],
  );

  if (isError) {
    return <ErrorAlert>{formatApiError(error)}</ErrorAlert>;
  }

  if (isFetching || !user) {
    return <LoadingPage />;
  }

  return (
    <>
      <EditProfileModal
        visible={editFormVisible}
        setVisible={setEditFormVisible}
        user={user}
        setUser={updateUser}
      />
      <Container className="mt-2">
        {ability.can("update", createUser(user)) && (
          <Button
            variant="secondary"
            className="my-2"
            onClick={() => setEditFormVisible(true)}
          >
            <EditIcon /> Изменить профиль
          </Button>
        )}
        <UserData user={user} />
      </Container>
    </>
  );
};

export default Profile;
