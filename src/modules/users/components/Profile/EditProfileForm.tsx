import { useFormik } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { BsCheckLg as SubmitIcon } from "react-icons/bs";
import { useSelector } from "react-redux";

import { formatApiError } from "src/api/utils";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { validators } from "src/modules/users/utils/validations";
import { useAppDispatch, type RootState } from "src/store";
import { setUser as setLoggedUser } from "src/store/auth.reducer";
import * as yup from "yup";
import { useUpdateUserMutation } from "../../api/users.api";
import { User, type IUser } from "../../models/user.model";
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
  setUser?: (u: IUser) => void;
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
  const [updateUser] = useUpdateUserMutation();

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
      await updateUser({
        id: user._id,
        dto: values,
      })
        .unwrap()
        .then((newUser) => {
          if (user._id === loggedUser?.id) {
            dispatch(
              setLoggedUser({
                id: user._id,
                role: newUser.role,
                name: newUser.name ?? undefined,
                username: newUser.username ?? undefined,
              }),
            );
          }
          toast.success("Профиль изменён");
          setVisible(false);
          if (setUser) setUser(newUser);
        })
        .catch((error) => {
          toast.error(formatApiError(error));
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
        disabled={!f.isValid || f.isSubmitting}
        icon={<SubmitIcon />}
      >
        Подтвердить
      </LoadingButton>
    </>
  );
};

export default EditProfileForm;
