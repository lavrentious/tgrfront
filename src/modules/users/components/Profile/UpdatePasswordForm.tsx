import { useFormik } from "formik";
import React from "react";
import { Form } from "react-bootstrap";
import { CheckLg as SubmitIcon } from "react-bootstrap-icons";
import { toast } from "react-hot-toast";
import { ApiError } from "src/modules/common/api";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { validators } from "src/modules/users/utils/validations";
import * as yup from "yup";
import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { Field as FormikField } from "./Field";

interface Values {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
  logout: boolean;
}

const validationSchema = yup.object().shape({
  oldPassword: validators.password,
  newPassword: validators.password,
  newPasswordRepeat: validators.password.oneOf([yup.ref("newPassword")]),
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
  const f = useFormik<Values>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordRepeat: "",
      logout: false,
    },
    onSubmit: async ({ oldPassword, newPassword, logout }) => {
      await UserService.updatePassword(user._id, {
        oldPassword,
        newPassword,
        logout,
      })
        .then(() => {
          toast.success("Пароль изменён");
          setVisible(false);
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
      <Form onSubmit={f.handleSubmit} id="updatePassword">
        <Field
          f={f}
          field="oldPassword"
          label="Старый пароль"
          placeholder="Введите старый пароль"
          required
        />
        <Field
          f={f}
          field="newPassword"
          label="Новый пароль"
          placeholder="Введите новый пароль"
          required
        />
        <Field
          f={f}
          field="newPasswordRepeat"
          label="Новый пароль повторно"
          placeholder="Введите новый пароль ещё раз"
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
        disabled={!f.isValid || f.isSubmitting}
        isLoading={f.isSubmitting}
        icon={<SubmitIcon />}
      >
        Подтвердить
      </LoadingButton>
    </>
  );
};

export default UpdatePasswordForm;
