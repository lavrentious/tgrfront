import { useFormik } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { BsCheckLg as SubmitIcon } from "react-icons/bs";
import * as yup from "yup";
import { User } from "../../models/user.model";
import { Field as FormikField } from "./Field";

import { formatApiError } from "src/api/utils";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { validators } from "src/modules/users/utils/validations";
import { useUpdateUserPasswordMutation } from "../../api/users.api";

interface Values {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
  logout: boolean;
}

const validationSchema = yup.object().shape({
  oldPassword: validators.password,
  newPassword: validators.password,
  newPasswordRepeat: validators.password.oneOf(
    [yup.ref("newPassword")],
    "Пароли должны совпадать",
  ),
  logout: yup.boolean().required(),
});

interface UpdatePasswordFormProps {
  user: User;
  setVisible: (v: boolean) => void;
}

const Field = FormikField<Values>;

const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({
  user,
  setVisible,
}) => {
  const [updatePassword, { isLoading }] = useUpdateUserPasswordMutation();

  const f = useFormik<Values>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordRepeat: "",
      logout: false,
    },
    validationSchema,
    validateOnBlur: true,
    onSubmit: async ({ oldPassword, newPassword, logout }) => {
      await updatePassword({
        dto: {
          oldPassword,
          newPassword,
          logout,
        },
        id: user._id,
      })
        .unwrap()
        .then(() => {
          toast.success("Пароль изменён");
          setVisible(false);
        })
        .catch((error) => {
          toast.error(formatApiError(error));
        });
    },
  });

  return (
    <>
      <Form onSubmit={f.handleSubmit} id="updatePassword">
        <Field
          f={f}
          field="oldPassword"
          label="Старый пароль"
          placeholder="Введите старый пароль"
          type="password"
          required
        />
        <Field
          f={f}
          field="newPassword"
          label="Новый пароль"
          placeholder="Введите новый пароль"
          type="password"
          required
        />
        <Field
          f={f}
          field="newPasswordRepeat"
          label="Новый пароль повторно"
          placeholder="Введите новый пароль ещё раз"
          type="password"
          required
        />
        <Form.Check
          className="ms-1 my-3"
          id="logout"
          checked={f.values.logout}
          onChange={f.handleChange}
          label="Выйти из аккаунта на других устройствах"
        />
      </Form>
      <LoadingButton
        variant="success"
        form="updatePassword"
        type="submit"
        disabled={!f.isValid || isLoading}
        isLoading={isLoading}
        icon={<SubmitIcon />}
      >
        Подтвердить
      </LoadingButton>
    </>
  );
};

export default UpdatePasswordForm;
