import useToggle from "beautiful-react-hooks/useToggle";
import { useFormik } from "formik";
import React from "react";
import { Container, Form, FormControl, InputGroup } from "react-bootstrap";
import toast from "react-hot-toast";
import { ApiError } from "src/modules/common/api";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import VisibilityButton from "src/modules/common/components/VisibilityButton/VisibilityButton";
import * as yup from "yup";
import { AuthService } from "../../services/auth.service";
import * as rules from "../../utils/validations";
import { validators } from "../../utils/validations";

interface Values {
  email: string;
  password: string;
  passwordRepeat: string;
  username?: string;
  name?: string;
}

const validationSchema = yup.object().shape({
  username: validators.username,
  password: validators.password,
  passwordRepeat: validators.password.oneOf([yup.ref("password")]),
  email: validators.email,
  name: validators.name,
});

const Register: React.FC = () => {
  const [passwordVisible, togglePasswordVisible] = useToggle();
  const f = useFormik<Values>({
    initialValues: {
      username: "",
      password: "",
      passwordRepeat: "",
      email: "",
      name: "",
    },
    onSubmit: async ({ email, password, name, username }) => {
      await AuthService.register({
        email,
        password,
        name: name || undefined,
        username: username || undefined,
      })
        .then(() => {
          toast.success("Аккаунт успешно создан");
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
        <h4>Регистрация</h4>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group className="my-2">
            <Form.FloatingLabel controlId="email" label="Email">
              <FormControl
                onBlur={f.handleBlur}
                value={f.values.email}
                onChange={f.handleChange}
                placeholder="email@domain.ru"
                isInvalid={f.touched.email && !!f.errors.email}
                isValid={f.touched.email && !f.errors.email}
              />
            </Form.FloatingLabel>
            <Form.Text className="px-2">
              Электронная почта в обычном формате.
            </Form.Text>
          </Form.Group>

          <Form.Group className="my-2">
            <Form.FloatingLabel label="Логин" controlId="username">
              <FormControl
                onBlur={f.handleBlur}
                placeholder="Введите логин"
                value={f.values.username}
                onChange={f.handleChange}
                isInvalid={f.touched.username && !!f.errors.username}
                isValid={
                  f.touched.username &&
                  (!f.errors.username || !!f.values.username)
                }
              />
            </Form.FloatingLabel>
            <Form.Text className="px-2">
              <i>Необязательно</i>. {rules.username.length.min}-
              {rules.username.length.max} симв. Латинские буквы (мин. 1), цифры,
              нижнее подчеркивание.
            </Form.Text>
          </Form.Group>

          <Form.Group className="my-2">
            <Form.FloatingLabel controlId="name" label="Имя">
              <FormControl
                onBlur={f.handleBlur}
                placeholder="Введите имя"
                value={f.values.name}
                onChange={f.handleChange}
                isInvalid={f.touched.name && !!f.errors.name}
                isValid={f.touched.name && (!f.errors.name || !!f.values.name)}
              />
            </Form.FloatingLabel>
            <Form.Text className="px-2">
              <i>Необязательно</i>. {rules.name.length.min}-
              {rules.name.length.max} симв.
            </Form.Text>
          </Form.Group>

          <Form.Group className="my-2">
            <InputGroup>
              <Form.FloatingLabel label="Пароль" controlId="password">
                <Form.Control
                  placeholder="Введите пароль"
                  onBlur={f.handleBlur}
                  type={passwordVisible ? "text" : "password"}
                  value={f.values.password}
                  onChange={f.handleChange}
                  isInvalid={f.touched.password && !!f.errors.password}
                  isValid={f.touched.password && !f.errors.password}
                />
              </Form.FloatingLabel>
              <VisibilityButton
                variant="outline-secondary"
                visible={passwordVisible}
                toggleVisible={togglePasswordVisible}
              />
            </InputGroup>
            <Form.Text className="px-2">
              {rules.password.length.min}-{rules.password.length.max} симв.
              Латинские и спецсимволы.
            </Form.Text>
          </Form.Group>

          <Form.FloatingLabel controlId="passwordRepeat" label="Повтор пароля">
            <Form.Control
              onBlur={f.handleBlur}
              placeholder="Введите пароль ещё раз"
              type="password"
              value={f.values.passwordRepeat}
              onChange={f.handleChange}
              isInvalid={f.touched.passwordRepeat && !!f.errors.passwordRepeat}
              isValid={f.touched.passwordRepeat && !f.errors.passwordRepeat}
            />
          </Form.FloatingLabel>

          <LoadingButton
            isLoading={f.isSubmitting}
            type="submit"
            className="mt-2"
            disabled={!f.isValid || f.isSubmitting}
          >
            Зарегистрироваться
          </LoadingButton>
        </Form>
      </Container>
    </>
  );
};

export default Register;
