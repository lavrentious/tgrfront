import React, { useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  CheckLg as SubmitIcon,
  XLg as CancelIcon,
} from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { RootState, useAppDispatch } from "src/store";
import {
  addFile,
  resetForm,
  setFiles,
  setIsCreationFormShown,
  setIsFormDisabled,
} from "src/store/createSpot.reducer";
import CreateSpotForm, {
  CreateSpotFormOnSubmit,
} from "../CreateSpot/CreateSpotForm";

import { UpdateRecordDto } from "../../dto/update-record.dto";
import { Record, RecordPhoto } from "../../models/record.model";
import { RecordsService } from "../../services/records.service";

interface EditSpotModalProps {
  record: Record;
}

const EditSpotModal: React.FC<EditSpotModalProps> = ({ record }) => {
  const dispatch = useAppDispatch();
  const { isCreationFormShown, isFormDisabled, files } = useSelector(
    (state: RootState) => state.createSpot
  );

  const initPhotos = useRef<RecordPhoto[]>([]);
  useEffect(() => {
    initPhotos.current = record.photos.slice();
    dispatch(resetForm());
    if (isCreationFormShown) {
      for (const photo of record.photos) {
        dispatch(
          addFile({
            dto: { comment: photo.comment },
            file: { name: photo.url, url: photo.url, size: 0 },
            meta: { fromDB: photo },
          })
        );
      }
      dispatch(setFiles(record.photos.map((p) => p.url)));
    }
  }, [isCreationFormShown]);

  const onSubmit: CreateSpotFormOnSubmit = (values) => {
    dispatch(setIsFormDisabled(true));
    RecordsService.update(
      record._id,
      values as UpdateRecordDto,
      files.allIds.map((url) => files.byId[url]),
      initPhotos.current
    )
      .then(() => {
        window.location.reload();
      })
      .finally(() => {
        dispatch(setIsFormDisabled(false));
      });
  };

  return (
    <Modal
      show={isCreationFormShown}
      onHide={() => dispatch(setIsCreationFormShown(false))}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Изменение места ({record.name})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CreateSpotForm record={record} onSubmit={onSubmit} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => dispatch(setIsCreationFormShown(false))}
        >
          <CancelIcon /> Отмена
        </Button>
        <LoadingButton
          variant="success"
          type="submit"
          form="createSpotFormId"
          isLoading={isFormDisabled}
          icon={<SubmitIcon />}
        >
          Подтвердить
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSpotModal;
