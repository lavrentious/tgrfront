import { FormikValues, useFormik } from "formik";
import React from "react";
import { Form, FormControl } from "react-bootstrap";

interface IFieldProps<Values extends FormikValues> {
  f: ReturnType<typeof useFormik<Values>>;
  field: keyof Values;
  label?: string;
  placeholder?: string;
  required?: boolean;
}
export function Field<Values extends FormikValues>({
  f,
  field,
  label,
  placeholder,
  required,
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
        id={field.toString()}
        onBlur={f.handleBlur}
        value={f.values[field]}
        onChange={f.handleChange}
        placeholder={placeholder ?? ""}
        isInvalid={f.touched[field] && !!f.errors[field]}
        isValid={f.touched[field] && !f.errors[field]}
      />
    </Form.Group>
  );
}
