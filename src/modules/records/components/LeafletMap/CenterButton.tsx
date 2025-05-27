import clsx from "clsx";
import React from "react";
import { Button, type ButtonProps } from "react-bootstrap";
import { RiMapPin5Line as CenterIcon } from "react-icons/ri";
import "./leafletMap.css";

interface CenterButtonProps extends ButtonProps {
  setCenter: () => void;
  icon?: React.ReactNode;
}

const CenterButton: React.FC<CenterButtonProps> = ({
  setCenter,
  icon,
  ...props
}) => {
  return (
    <Button
      variant="info"
      {...props}
      className={clsx("m-1 mb-3 p-2 rounded-circle", props.className)}
      onClick={() => {
        setCenter();
      }}
    >
      {icon || <CenterIcon />}
    </Button>
  );
};

export default CenterButton;
