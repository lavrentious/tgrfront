import React from "react";
import { Button, Modal } from "react-bootstrap";
import { BsXLg as CancelIcon } from "react-icons/bs";
import { User, type IUser } from "../../models/user.model";
import EditProfileForm from "./EditProfileForm";
import UpdatePasswordForm from "./UpdatePasswordForm";

interface EditProfileModalProps {
  user: User;
  visible: boolean;
  setVisible: (v: boolean) => void;
  setUser?: (u: IUser) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  visible,
  setVisible,
  setUser,
}) => {
  return (
    <Modal
      show={visible}
      onHide={() => setVisible(false)}
      backdrop="static"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Изменение профиля {user.username ?? user._id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditProfileForm
          user={user}
          setVisible={setVisible}
          setUser={setUser}
        />
        <hr />
        <Modal.Title>Изменение пароля</Modal.Title>
        <UpdatePasswordForm user={user} setVisible={setVisible} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="me-2"
          variant="secondary"
          onClick={() => setVisible(false)}
        >
          <CancelIcon /> Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
