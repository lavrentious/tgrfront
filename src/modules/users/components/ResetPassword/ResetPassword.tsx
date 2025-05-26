import useToggle from "beautiful-react-hooks/useToggle";
import { useFormik } from "formik";
import { useEffect } from "react";
import { Container, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import LoadingPage from "src/modules/common/components/LoadingPage";
import VisibilityButton from "src/modules/common/components/VisibilityButton/VisibilityButton";
import * as yup from "yup";

import {
  useLazyCheckPasswordResetQuery,
  useResetPasswordMutation,
} from "../../api/users.api";
import * as rules from "../../utils/validations";
import { validators } from "../../utils/validations";

interface Values {
  password: string;
  passwordRepeat: string;
}

const validationSchema = yup.object().shape({
  password: validators.password,
  passwordRepeat: validators.password.oneOf([yup.ref("password")]),
});

const ResetPassword = () => {
  const { key } = useParams() as { key: string };
  const navigate = useNavigate();

  // const check = useFetch(async () => PasswordResetsApi.check(key));
  const [check, { error, isFetching }] = useLazyCheckPasswordResetQuery();

  useEffect(() => {
    check(key);
  }, [check, key]);

  useEffect(() => {
    if (error) return navigate("/login");
  }, [error, navigate]);

  const [resetPassword] = useResetPasswordMutation();

  const submit = async ({ password }: Values) => {
    // await PasswordResetsApi.reset(key, password)
    //   .then(() => {
    //     toast.success("Пароль успешно изменён");
    //     navigate("/login");
    //   })
    //   .catch((e: ApiError) => {
    //     const msg = e.response?.data.message;
    //     toast.error(msg ?? e.message);
    //   });
    resetPassword({ key, password })
      .unwrap()
      .then(() => {
        toast.success("Пароль успешно изменён");
        navigate("/login");
      })
      .catch((e: unknown) => {
        toast.error(new String(e).toString());
      });
  };
  const [passwordVisible, togglePasswordVisible] = useToggle();
  const f = useFormik<Values>({
    initialValues: {
      password: "",
      passwordRepeat: "",
    },
    onSubmit: submit,
    validationSchema,
    validateOnBlur: true,
  });

  if (isFetching) {
    return <LoadingPage />;
  }

  return (
    <>
      <Container className="mt-2">
        <h4>Сброс пароля</h4>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group className="my-2">
            <InputGroup>
              <Form.Control
                id="password"
                placeholder="Введите новый пароль"
                onBlur={f.handleBlur}
                type={passwordVisible ? "text" : "password"}
                value={f.values.password}
                onChange={f.handleChange}
                isInvalid={f.touched.password && !!f.errors.password}
                isValid={f.touched.password && !f.errors.password}
              />
              <VisibilityButton
                variant="outline-secondary"
                visible={passwordVisible}
                toggleVisible={togglePasswordVisible}
              />
            </InputGroup>
            <Form.Text className="px-2">
              {rules.password.length.min}-{rules.password.length.max} симв.
              Латинские буквы, цифры и спецсимволы.
            </Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Control
              id="passwordRepeat"
              onBlur={f.handleBlur}
              placeholder="Введите новый пароль ещё раз"
              type="password"
              value={f.values.passwordRepeat}
              onChange={f.handleChange}
              isInvalid={f.touched.passwordRepeat && !!f.errors.passwordRepeat}
              isValid={f.touched.passwordRepeat && !f.errors.passwordRepeat}
            />
          </Form.Group>

          <LoadingButton
            isLoading={f.isSubmitting}
            type="submit"
            className="mt-2"
            disabled={!f.isValid || f.isSubmitting}
          >
            Сбросить пароль
          </LoadingButton>
        </Form>
      </Container>
    </>
  );
};

export default ResetPassword;
