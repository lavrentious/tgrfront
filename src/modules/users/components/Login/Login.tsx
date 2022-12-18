import useToggle from "beautiful-react-hooks/useToggle";
import { useFormik } from "formik";
import React from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { ApiError } from "src/modules/common/api";
import VisibilityButton from "src/modules/common/components/VisibilityButton/VisibilityButton";
import * as yup from "yup";
import { validators } from "../../utils/validations";
import { AuthService } from "../../services/auth.service";

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
        validators.email.isValidSync(v) || validators.username.isValidSync(v)
    ),
  password: validators.password,
});

const Login: React.FC = () => {
  const [passwordVisible, togglePasswordVisible] = useToggle();
  const formik = useFormik<Values>({
    initialValues: {
      usernameOrEmail: "",
      password: "",
    },
    onSubmit: async (values) => {
      await AuthService.login(values)
        .then(({ data }) => {
          toast.success(() => (
            <span>
              Вы вошли как <b>{data.user.username ?? data.user.id}</b>
            </span>
          ));
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
      <Container className="mt-2">
        <h4>Авторизация</h4>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="usernameOrEmail">Email или логин</Form.Label>
            <FormControl
              onBlur={formik.handleBlur}
              id="usernameOrEmail"
              value={formik.values.usernameOrEmail}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.usernameOrEmail &&
                !!formik.errors.usernameOrEmail
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="password">Пароль</Form.Label>
            <InputGroup>
              <Form.Control
                onBlur={formik.handleBlur}
                id="password"
                type={passwordVisible ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                isInvalid={formik.touched.password && !!formik.errors.password}
              />
              <VisibilityButton
                variant="outline-secondary"
                visible={passwordVisible}
                toggleVisible={togglePasswordVisible}
              />
            </InputGroup>
          </Form.Group>

          <Button type="submit" className="mt-2" disabled={!formik.isValid}>
            Войти
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Login;
