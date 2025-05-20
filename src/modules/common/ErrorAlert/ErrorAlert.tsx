import React from "react";
import { Alert, type AlertProps } from "react-bootstrap";

interface ErrorAlertProps extends AlertProps {
  children?: React.ReactNode;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ children }) => {
  return <Alert variant="danger">{children}</Alert>;
};

export default ErrorAlert;
