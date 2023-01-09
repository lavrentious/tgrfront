import React from "react";
import { Button, Modal } from "react-bootstrap";
import {
  CheckLg as SubmitIcon,
  DashLg as HideIcon,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import LoadingButton from "src/modules/common/components/LoadingButton/LoadingButton";
import { RootState } from "src/store";
import { setIsCreationFormShown } from "src/store/createSpot.reducer";
import CreateSpotForm from "./CreateSpotForm";

const CreateSpotModal = () => {
  const dispatch = useDispatch();
  const { selectedSpot } = useSelector((state: RootState) => state.createSpot);
  const { isCreationFormShown, isFormDisabled } = useSelector(
    (state: RootState) => state.createSpot
  );

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
        <CreateSpotForm />
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
