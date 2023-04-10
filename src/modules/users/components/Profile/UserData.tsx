import React from "react";
import { ListGroup } from "react-bootstrap";
import { DateItem } from "src/modules/records/components/RecordView/RecordData";
import { User } from "src/modules/users/models/user.model";

interface UserDataProps {
  user: User;
}

const UserData: React.FC<UserDataProps> = ({ user }) => {
  return (
    <ListGroup>
      <ListGroup.Item>ID: {user._id}</ListGroup.Item>
      {user.username && <ListGroup.Item>Логин: {user.username}</ListGroup.Item>}
      {user.name && <ListGroup.Item>Имя: {user.name}</ListGroup.Item>}
      {user.email && <ListGroup.Item>Email: {user.email}</ListGroup.Item>}
      <DateItem date={user.createdAt} title="Дата регистрации" />
    </ListGroup>
  );
};

export default UserData;
