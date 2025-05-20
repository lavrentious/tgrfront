import React from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { type RootState, useAppDispatch } from "src/store";
import { setIsAddressSearchShown } from "src/store/map.reducer";
import AddressSearch from "./AddressSearch";
interface IAddressSearchModalProps {
  select?: (lat: number, lng: number) => void;
}

const AddressSearchModal: React.FC<IAddressSearchModalProps> = ({ select }) => {
  const { isAddressSearchShown } = useSelector((state: RootState) => state.map);
  const dispatch = useAppDispatch();
  return (
    <>
      <Modal
        show={isAddressSearchShown}
        trigger="click"
        placement="auto"
        onHide={() => dispatch(setIsAddressSearchShown(false))}
      >
        <Modal.Header closeButton>Поиск адреса</Modal.Header>
        <Modal.Body>
          <AddressSearch select={select} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddressSearchModal;
