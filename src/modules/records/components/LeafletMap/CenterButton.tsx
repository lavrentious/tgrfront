import clsx from "clsx";
import React from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { PinMap as CenterIcon } from "react-bootstrap-icons";
import "./leafletMap.css";

interface CenterButtonProps extends ButtonProps {
  setCenter: () => void;
}

const CenterButton: React.FC<CenterButtonProps> = ({ setCenter, ...props }) => {
  return (
    <Button
      variant="info"
      {...props}
      className={clsx("m-1 mb-3 p-2 rounded-circle", props.className)}
      onClick={() => {
        setCenter();
      }}
    >
      <CenterIcon />
    </Button>
  );
};

export default CenterButton;
