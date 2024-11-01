import * as yup from "yup";

export const username = {
  regexp: /^(?=.*[a-zA-Z])\w+$/,
  length: { min: 3, max: 64 },
};

export const password = {
  regexp: /^[\w^[!"#$%&'()*+,\-./:;<=>?@]*$/,
  length: { min: 8, max: 256 },
};

export const name = {
  length: { min: 0, max: 256 },
};

export const validators = {
  password: yup
    .string()
    .required()
    .matches(password.regexp)
    .min(password.length.min)
    .max(password.length.max),
  username: yup
    .string()
    .optional()
    .matches(username.regexp)
    .min(username.length.min)
    .max(username.length.max),
  email: yup.string().required().email(),
  name: yup.string().optional().min(name.length.min).max(name.length.max),
};
