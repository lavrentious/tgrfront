import { useAbility } from "@casl/react";
import React, { useEffect, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { Trash as DeleteIcon } from "react-bootstrap-icons";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { AbilityContext } from "src/modules/ability/ability";
import { ApiError } from "src/modules/common/api";
import ErrorAlert from "src/modules/common/ErrorAlert/ErrorAlert";
import useFetch from "src/modules/common/hooks/useFetch";
import { Record } from "../../models/record.model";
import { RecordsService } from "../../services/records.service";
import RecordData from "./RecordData";

const RecordView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const ability = useAbility(AbilityContext);

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
    <Container className="mt-2">
      {ability.can("delete", record) && (
        <Button
          variant="danger"
          onClick={() =>
            RecordsService.delete(record._id)
              .then(() => navigate("/map"))
              .catch((e: ApiError) =>
                toast.error(e.response?.data.message ?? e.message)
              )
          }
        >
          <DeleteIcon /> Удалить
        </Button>
      )}
      <div className="mt-2">
        <RecordData record={record} />
      </div>
    </Container>
  );
};

export default RecordView;
