import React from "react";
import { Button, type ButtonProps } from "react-bootstrap";
import {
  RiEyeLine as HiddenIcon,
  RiEyeOffLine as VisibleIcon,
} from "react-icons/ri";

interface VisibilityButtonProps extends ButtonProps {
  visible: boolean;
  toggleVisible: () => void;
}

const VisibilityButton: React.FC<VisibilityButtonProps> = ({
  visible,
  toggleVisible,
  ...props
}) => {
  return (
    <Button onClick={toggleVisible} {...props}>
      {visible ? <VisibleIcon /> : <HiddenIcon />}
    </Button>
  );
};

export default VisibilityButton;
