import { useFormik } from "formik";
import { Container, Form, FormControl, InputGroup } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import * as yup from "yup";
import { useCreatePasswordResetMutation } from "../../api/users.api";
import { validators } from "../../utils/validations";

interface Values {
  usernameOrEmail: string;
}

const validationSchema = yup.object().shape({
  usernameOrEmail: yup
    .string()
    .required()
    .test(
      (v) =>
        validators.email.isValidSync(v) || validators.username.isValidSync(v),
    ),
});

const CreatePasswordReset = () => {
  const navigate = useNavigate();

  const [createPasswordReset] = useCreatePasswordResetMutation();

  const submit = async ({ usernameOrEmail }: Values) => {
    createPasswordReset({ usernameOrEmail })
      .unwrap()
      .then(() => {
        toast.success("Письмо с инструкцией отправлено на ваш email");
        navigate("/login");
      })
      .catch((e: unknown) => {
        toast.error(new String(e).toString());
      });
  };
  const f = useFormik<Values>({
    initialValues: {
      usernameOrEmail: "",
    },
    onSubmit: submit,
    validationSchema,
    validateOnBlur: true,
  });
  return (
    <>
      <Container className="mt-2">
        <h4>Сброс пароля</h4>
        <Form onSubmit={f.handleSubmit}>
          <Form.Label htmlFor="usernameOrEmail">Email или логин</Form.Label>
          <InputGroup>
            <FormControl
              onBlur={f.handleBlur}
              id="usernameOrEmail"
              value={f.values.usernameOrEmail}
              onChange={f.handleChange}
              isInvalid={
                f.touched.usernameOrEmail && !!f.errors.usernameOrEmail
              }
            />
            <LoadingButton
              isLoading={f.isSubmitting}
              type="submit"
              disabled={!f.isValid || f.isSubmitting}
            >
              Сбросить пароль
            </LoadingButton>
          </InputGroup>
        </Form>
      </Container>
    </>
  );
};

export default CreatePasswordReset;
