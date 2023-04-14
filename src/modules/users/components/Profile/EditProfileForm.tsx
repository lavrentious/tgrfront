import { useFormik } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { CheckLg as SubmitIcon } from "react-bootstrap-icons";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { ApiError } from "src/modules/common/api";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { validators } from "src/modules/users/utils/validations";
import { RootState, useAppDispatch } from "src/store";
import { setUser as setLoggedUser } from "src/store/auth.reducer";
import * as yup from "yup";
import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { Field as FormikField } from "./Field";

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

interface EditProfileFormProps {
  user: User;
  setUser?: (u: User) => void;
  setVisible: (v: boolean) => void;
}

const Field = FormikField<Values>;

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  setUser,
  setVisible,
}) => {
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();

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
      await UserService.update(user._id, values, user)
        .then((newUser) => {
          if (user._id === loggedUser?.id) {
            dispatch(
              setLoggedUser({
                id: user._id,
                role: newUser.role,
                name: newUser.name ?? undefined,
                username: newUser.username ?? undefined,
              })
            );
          }
          toast.success("Профиль изменён");
          setVisible(false);
          if (setUser) setUser(new User(newUser));
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
    <>
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
      <LoadingButton
        variant="success"
        form="editProfile"
        type="submit"
        isLoading={f.isSubmitting}
        icon={<SubmitIcon />}
      >
        Подтвердить
      </LoadingButton>
    </>
  );
};

export default EditProfileForm;
