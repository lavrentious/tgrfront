import React from "react";
import { ListGroup } from "react-bootstrap";
import { DateItem } from "src/modules/records/components/RecordView/RecordData";
import { User } from "src/modules/users/models/user.model";
import ResendEmailButton from "./ResendEmailButton";
import RoleBadge from "./RoleBadge";

interface UserDataProps {
  user: User;
  setUser: (user: User) => void;
}

const EmailConfirmationState = React.memo(function EmailConfirmationState({
  user,
  setUser,
}: {
  user: User;
  setUser: (user: User) => void;
}) {
  if (user.emailConfirmed == null) return <></>;
  return (
    <>
      (
      {user.emailConfirmed ? (
        <span className="text-success">подтверждён</span>
      ) : (
        <span className="text-danger">не подтверждён</span>
      )}
      )
      <ResendEmailButton user={user} setUser={setUser} />
    </>
  );
});

const UserData: React.FC<UserDataProps> = ({ user, setUser }) => {
  return (
    <ListGroup>
      <ListGroup.Item>ID: {user._id}</ListGroup.Item>
      {user.username && <ListGroup.Item>Логин: {user.username}</ListGroup.Item>}
      {user.name && <ListGroup.Item>Имя: {user.name}</ListGroup.Item>}
      {user.email && (
        <ListGroup.Item>
          Email: {user.email}{" "}
          <EmailConfirmationState user={user} setUser={setUser} />
        </ListGroup.Item>
      )}
      <ListGroup.Item>
        Роль: <RoleBadge role={user.role} />
      </ListGroup.Item>
      <DateItem date={user.createdAt} title="Зарегистрирован" />
      <DateItem date={user.updatedAt} title="Обновлён" />
    </ListGroup>
  );
};

export default UserData;
