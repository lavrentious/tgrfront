import { useFormik } from "formik";
import React from "react";
import { Button, Form, FormControl, Modal } from "react-bootstrap";
import {
  CheckLg as SubmitIcon,
  XLg as CancelIcon,
} from "react-bootstrap-icons";
import { toast } from "react-hot-toast";
import { ApiError } from "src/modules/common/api";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { validators } from "src/modules/users/utils/validations";
import * as yup from "yup";
import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";

interface EditProfileModalProps {
  user: User;
  visible: boolean;
  setVisible: (v: boolean) => void;
  setUser?: (u: User) => void;
}

interface Values {
  email?: string;
  username?: string;
  name?: string;
}

const validationSchema = yup.object().shape({
  username: validators.username,
  email: validators.email,
  name: validators.name,
});

interface IFieldProps {
  f: ReturnType<typeof useFormik<Values>>;
  field: keyof Values;
  label?: string;
  placeholder?: string;
  required?: boolean;
}
const Field: React.FC<IFieldProps> = ({
  f,
  field,
  label,
  placeholder,
  required,
}) => {
  return (
    <Form.Group className="my-2">
      {label && (
        <Form.Label htmlFor={field}>
          {label}
          {required && <span className="text-danger"> *</span>}
        </Form.Label>
      )}
      <FormControl
        id={field}
        onBlur={f.handleBlur}
        value={f.values[field]}
        onChange={f.handleChange}
        placeholder={placeholder ?? ""}
        isInvalid={f.touched[field] && !!f.errors[field]}
        isValid={f.touched[field] && !f.errors[field]}
      />
    </Form.Group>
  );
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  visible,
  setVisible,
  setUser,
}) => {
  const f = useFormik<Values>({
    initialValues: {
      email: user.email,
      username: user.username || "",
      name: user.name || "",
    },
    onSubmit: async ({ email, name, username }) => {
      const values = {
        email,
        name: name || null,
        username: username || null,
      };
      await UserService.update(user._id, values)
        .then(() => {
          toast.success("Профиль изменён");
          setVisible(false);
          if (setUser) setUser(new User({ ...user, ...values }));
        })
        .catch((e: ApiError) => {
          const msg = e.response?.data.message;
          toast.error(msg ?? e.message);
        });
    },
    validationSchema,
    validateOnBlur: true,
  });

  return (
    <Modal
      show={visible}
      onHide={() => setVisible(false)}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Изменение профиля {user.username ?? user._id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={f.handleSubmit} id="editProfile">
          <Field
            f={f}
            field="email"
            label="Email"
            placeholder={user.email}
            required
          />
          <Field
            f={f}
            field="username"
            label="Логин"
            placeholder={user.username || "Введите логин"}
          />
          <Field
            f={f}
            field="name"
            label="Имя"
            placeholder={user.name || "Введите имя"}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setVisible(false)}>
          <CancelIcon /> Отмена
        </Button>
        <LoadingButton
          variant="success"
          form="editProfile"
          type="submit"
          isLoading={f.isSubmitting}
          icon={<SubmitIcon />}
        >
          Подтвердить
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
