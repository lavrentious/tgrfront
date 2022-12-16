import React from 'react'
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import { setIsAddressSearchShown } from "src/store/mapReducer";
import AddressSearch from "./AddressSearch";

const AddressSearchModal = () => {
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
          <AddressSearch />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddressSearchModal;
