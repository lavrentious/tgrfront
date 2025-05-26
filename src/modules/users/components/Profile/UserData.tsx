import React from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DateItem } from "src/modules/records/components/RecordView/RecordData";
import { User } from "src/modules/users/models/user.model";
import ResendEmailButton from "./ResendEmailButton";
import RoleBadge from "./RoleBadge";

interface UserDataProps {
  user: User;
}

const EmailConfirmationState = React.memo(function EmailConfirmationState({
  user,
}: {
  user: User;
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
      <ResendEmailButton user={user} />
    </>
  );
});

const UserData: React.FC<UserDataProps> = ({ user }) => {
  return (
    <ListGroup>
      <ListGroup.Item>ID: {user._id}</ListGroup.Item>
      {user.username && <ListGroup.Item>Логин: {user.username}</ListGroup.Item>}
      {user.name && <ListGroup.Item>Имя: {user.name}</ListGroup.Item>}
      {user.email && (
        <ListGroup.Item>
          Email: {user.email} <EmailConfirmationState user={user} />
        </ListGroup.Item>
      )}
      <ListGroup.Item>
        Роль: <RoleBadge role={user.role} />
      </ListGroup.Item>
      {user.createdAt && (
        <DateItem date={user.createdAt} title="Зарегистрирован" />
      )}
      {user.updatedAt && <DateItem date={user.updatedAt} title="Обновлён" />}
      <ListGroup.Item>
        <Link to={`/record-search?author=${user._id}`}>
          Созданные пользователем места
        </Link>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default UserData;
