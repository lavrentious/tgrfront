import React from 'react';
import { Button } from "react-bootstrap";
import {
  CheckLg as SubmitIcon,
  PlusLg as CreateIcon,
  Search as SearchIcon,
  XLg as CancelIcon,
} from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import { setIsCreationFormShown } from "src/store/createSpotReducer";
import {
  setIsAddressSearchShown,
  setIsSelectingSpot,
  setSelectedSpot,
} from "src/store/mapReducer";
import { deleteFile } from "src/modules/records/components/CreateSpot/CreateSpotForm";

const ControlButtons = () => {
  const { isAddressSearchShown, isSelectingSpot, selectedSpot } = useSelector(
    (state: RootState) => state.map
  );
  const dispatch = useAppDispatch();
  const { files } = useSelector((state: RootState) => state.createSpot);
  const cancel = () => {
    dispatch(setSelectedSpot(null));
    for (const url of files) {
      deleteFile(url, dispatch);
    }
  };

  return (
    <div className="map-view__buttons">
      <Button
        onClick={() => dispatch(setIsAddressSearchShown(!isAddressSearchShown))}
        variant="secondary"
        size="lg"
        className="m-1 map-view__button p-2 rounded-circle"
        title="Поиск по адресу"
      >
        <SearchIcon />
      </Button>
      {!isSelectingSpot && !selectedSpot && (
        <Button
          variant="primary"
          size="lg"
          className="m-1 map-view__button p-3 rounded-circle"
          title="Создать новое место"
          onClick={() => dispatch(setIsSelectingSpot(true))}
        >
          <CreateIcon />
        </Button>
      )}
      {isSelectingSpot && (
        <Button
          variant="danger"
          size="lg"
          className="m-1 map-view__button p-3 rounded-circle"
          title="Отмена"
          onClick={() => dispatch(setIsSelectingSpot(false))}
        >
          <CancelIcon />
        </Button>
      )}
      {!isSelectingSpot && selectedSpot && (
        <div className="d-flex align-items-end">
          <Button
            variant="success"
            size="lg"
            className="m-1 map-view__button p-3 rounded-circle"
            title="Перейти к описанию места"
            onClick={() => dispatch(setIsCreationFormShown(true))}
          >
            <SubmitIcon />
          </Button>
          <Button
            variant="danger"
            className="m-1 map-view__button p-2 rounded-circle"
            title="Отменить создание места"
            onClick={() => cancel()}
          >
            <CancelIcon />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ControlButtons;
