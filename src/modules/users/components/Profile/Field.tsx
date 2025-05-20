import { type FormikValues, useFormik } from "formik";
import { Form, FormControl, type FormControlProps } from "react-bootstrap";

interface IFieldProps<Values extends FormikValues> extends FormControlProps {
  f: ReturnType<typeof useFormik<Values>>;
  field: keyof Values;
  label?: string;
  required?: boolean;
}
export function Field<Values extends FormikValues>({
  f,
  field,
  label,
  required,
  ...props
}: IFieldProps<Values>) {
  return (
    <Form.Group className="my-2">
      {label && (
        <Form.Label htmlFor={field.toString()}>
          {label}
          {required && <span className="text-danger"> *</span>}
        </Form.Label>
      )}
      <FormControl
        {...props}
        id={field.toString()}
        onBlur={f.handleBlur}
        value={f.values[field]}
        onChange={f.handleChange}
        isInvalid={f.touched[field] && !!f.errors[field]}
        isValid={f.touched[field] && !f.errors[field]}
      />
    </Form.Group>
  );
}
