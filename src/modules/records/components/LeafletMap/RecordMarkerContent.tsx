import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { IRecord } from "../../models/record.model";

type RecordMarkerContentProps = {
  record: IRecord;
};
const RecordMarkerContent: React.FC<RecordMarkerContentProps> = ({
  record,
}) => {
  const description = React.useMemo(() => {
    if (!record.description)
      return (
        <p>
          <i>Нет описания</i>
        </p>
      );
    if (record.description.length > 500)
      return <p>{record.description.slice(0, 500)}...</p>;
    return <p>{record.description}</p>;
  }, [record.description]);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {description}
      <Link to={`/record/${record._id}`}>
        <Button>Открыть</Button>
      </Link>
    </div>
  );
};
export default RecordMarkerContent;
