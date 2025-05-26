import { useAbility } from "@casl/react";
import React, { useCallback, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import {
  Trash as DeleteIcon,
  PencilFill as EditIcon,
} from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import type { ApiError } from "src/api/api";
import { AbilityContext } from "src/modules/ability/ability";
import LoadingPage from "src/modules/common/components/LoadingPage";
import ErrorAlert from "src/modules/common/ErrorAlert/ErrorAlert";
import { useAppDispatch } from "src/store";
import { setIsCreationFormShown } from "src/store/createSpot.reducer";

import toast from "react-hot-toast";
import { formatApiError } from "src/api/utils";
import {
  useDeleteRecordMutation,
  useLazyGetRecordQuery,
} from "../../api/records.api";
import { createRecord } from "../../utils";
import EditSpotModal from "./EditSpotModal";
import RecordData from "./RecordData";

const RecordView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const ability = useAbility(AbilityContext);

  const [fetchRecord, { data: record, isLoading, isError, error }] =
    useLazyGetRecordQuery();
  const [deleteRecord, { isLoading: isDeleting }] = useDeleteRecordMutation();

  const openEditModal = () => dispatch(setIsCreationFormShown(true));

  useEffect(() => {
    if (!id) return;
    fetchRecord(id);
  }, [fetchRecord, id]);

  const handleDelete = useCallback(() => {
    if (!record) return;
    if (
      !window.confirm(
        `Вы уверены, что хотите удалить "${record.name}"? Это действие нельзя отменить.`,
      )
    )
      return;
    deleteRecord(record._id)
      .unwrap()
      .then(() => navigate("/map"))
      .catch((e: ApiError) => {
        toast.error(formatApiError(e));
      });
  }, [deleteRecord, navigate, record]);

  if (isError) {
    return <ErrorAlert>{formatApiError(error)}</ErrorAlert>;
  }

  if (isLoading || !record) {
    return <LoadingPage />;
  }

  return (
    <Container className="mt-2">
      {ability.can("update", createRecord(record)) && (
        <Button
          className="me-1"
          variant="secondary"
          onClick={openEditModal}
          disabled={isDeleting}
        >
          <EditIcon /> Редактировать
        </Button>
      )}
      {ability.can("delete", createRecord(record)) && (
        <Button
          className="me-1"
          variant="danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <DeleteIcon /> Удалить
        </Button>
      )}
      <EditSpotModal
        record={record}
        onSuccess={() => fetchRecord(record._id)}
      />
      <div className="mt-2">
        <RecordData record={record} />
      </div>
    </Container>
  );
};

export default RecordView;
