import React from "react";
import { Spinner } from "react-bootstrap";
import { CheckLg, XLg } from "react-bootstrap-icons";
import { FileStatus } from "src/store/createSpot.reducer";

interface StatusIconProps {
  status: FileStatus | null;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  switch (status) {
    case FileStatus.PENDING:
      return <Spinner animation="border" size="sm" />;
    case FileStatus.FAILED:
      return <XLg className="text-danger" />;
    case FileStatus.SUCCESS:
      return <CheckLg className="text-success" />;
    default:
      return <></>;
  }
};

export default StatusIcon;
