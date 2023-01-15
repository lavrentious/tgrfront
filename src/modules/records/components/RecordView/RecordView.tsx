import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ErrorAlert from "src/modules/common/ErrorAlert/ErrorAlert";
import useFetch from "src/modules/common/hooks/useFetch";
import { Record } from "../../models/record.model";
import { RecordsService } from "../../services/records.service";
import RecordData from "./RecordData";

const RecordView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState<Record | null>(null);
  const { fetch, error, isFetching } = useFetch(() =>
    RecordsService.findOne(id as string)
  );

  useEffect(() => {
    if (!id) return navigate("/");
    fetch().then((res) => setRecord(res ?? null));
  }, []);
  if (error) {
    return (
      <ErrorAlert>{error.response?.data?.message ?? error.message}</ErrorAlert>
    );
  }
  if (isFetching || !record) {
    return <Spinner animation="border" />;
  }
  return (
    <Container>
      <RecordData record={record} />
    </Container>
  );
};

export default RecordView;
