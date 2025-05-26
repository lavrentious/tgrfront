import useToggle from "beautiful-react-hooks/useToggle";
import { useFormik } from "formik";
import React, { useCallback } from "react";
import { Container, Form, FormControl, InputGroup } from "react-bootstrap";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { formatApiError } from "src/api/utils";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import VisibilityButton from "src/modules/common/components/VisibilityButton/VisibilityButton";
import { useAppDispatch } from "src/store";
import { setUser } from "src/store/auth.reducer";
import * as yup from "yup";
import { useLoginMutation } from "../../api/auth.api";
import { TokenService } from "../../services/token.service";
import { validators } from "../../utils/validations";

interface Values {
  usernameOrEmail: string;
  password: string;
}

const validationSchema = yup.object().shape({
  usernameOrEmail: yup
    .string()
    .required()
    .test(
      (v) =>
        validators.email.isValidSync(v) || validators.username.isValidSync(v),
    ),
  password: validators.password,
});

const Login: React.FC = () => {
  const dispatch = useAppDispatch();

  const [passwordVisible, togglePasswordVisible] = useToggle();
  const [login, { isLoading }] = useLoginMutation();

  const submit = useCallback(
    async (values: Values) => {
      login(values)
        .unwrap()
        .then((data) => {
          TokenService.accessToken = data.accessToken;
          dispatch(setUser(data.user));
          toast.success(() => (
            <span>
              Вы вошли как <b>{data.user.username ?? data.user.id}</b>
            </span>
          ));
        })
        .catch((e) => {
          toast.error(formatApiError(e));
        });
    },
    [dispatch, login],
  );

  const f = useFormik<Values>({
    initialValues: {
      usernameOrEmail: "",
      password: "",
    },
    onSubmit: submit,
    validationSchema,
    validateOnBlur: true,
  });
  return (
    <>
      <Container className="mt-2">
        <h4>Авторизация</h4>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="usernameOrEmail">Email или логин</Form.Label>
            <FormControl
              onBlur={f.handleBlur}
              id="usernameOrEmail"
              value={f.values.usernameOrEmail}
              onChange={f.handleChange}
              isInvalid={
                f.touched.usernameOrEmail && !!f.errors.usernameOrEmail
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="password">Пароль</Form.Label>
            <InputGroup>
              <Form.Control
                onBlur={f.handleBlur}
                id="password"
                type={passwordVisible ? "text" : "password"}
                value={f.values.password}
                onChange={f.handleChange}
                isInvalid={f.touched.password && !!f.errors.password}
              />
              <VisibilityButton
                variant="outline-secondary"
                visible={passwordVisible}
                toggleVisible={togglePasswordVisible}
              />
            </InputGroup>
          </Form.Group>

          <div className="d-flex align-items-center mt-2">
            <LoadingButton
              isLoading={isLoading}
              type="submit"
              className="me-2"
              disabled={!f.isValid}
            >
              Войти
            </LoadingButton>
            <Link to="/request-password-reset">Сбросить пароль</Link>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Login;
