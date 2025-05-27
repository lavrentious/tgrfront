import React from "react";
import { Spinner } from "react-bootstrap";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import { FileStatus } from "src/modules/records/records.types";

interface StatusIconProps {
  status: FileStatus | null;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  switch (status) {
    case FileStatus.PENDING:
      return <Spinner animation="border" size="sm" />;
    case FileStatus.FAILED:
      return <BsXLg className="text-danger" />;
    case FileStatus.SUCCESS:
      return <BsCheckLg className="text-success" />;
    default:
      return <></>;
  }
};

export default StatusIcon;
