import React from "react";
import { Button, Modal } from "react-bootstrap";
import {
  CheckLg as SubmitIcon,
  DashLg as HideIcon,
} from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { RootState, useAppDispatch } from "src/store";
import { resetForm, setIsCreationFormShown, setIsFormDisabled } from "src/store/createSpot.reducer";
import { CreateRecordDto } from "../../dto/create-record.dto";
import { RecordsService } from "../../services/records.service";
import CreateSpotForm, { CreateSpotFormOnSubmit } from "./CreateSpotForm";

const CreateSpotModal = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedSpot } = useSelector((state: RootState) => state.createSpot);
  const { isCreationFormShown, isFormDisabled, files } = useSelector(
    (state: RootState) => state.createSpot
  );

  const onSubmit: CreateSpotFormOnSubmit = (values) => {
    if (!selectedSpot) return;
    console.log("submit", values);
    dispatch(setIsFormDisabled(true));
    RecordsService.create(
      {
        ...values,
        lat: selectedSpot[0],
        lon: selectedSpot[1],
      } as CreateRecordDto,
      files.allIds.map((url) => files.byId[url])
    )
      .then((record) => {
        resetForm();
        dispatch(setIsCreationFormShown(false));
        navigate(`/record/${record.record._id}`);
      })
      .finally(() => {
        dispatch(setIsFormDisabled(false));
      });
  };

  return (
    <Modal
      show={selectedSpot != null && isCreationFormShown}
      onHide={() => dispatch(setIsCreationFormShown(false))} // TODO: save form data on close modal
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Создание нового места</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CreateSpotForm onSubmit={onSubmit} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          title="Свернуть форму. Данные сохранятся."
          onClick={() => dispatch(setIsCreationFormShown(false))}
        >
          <HideIcon /> Свернуть (вернуться к выбору места)
        </Button>
        <LoadingButton
          variant="success"
          type="submit"
          form="createSpotFormId"
          isLoading={isFormDisabled}
          icon={<SubmitIcon />}
        >
          Создать
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateSpotModal;
