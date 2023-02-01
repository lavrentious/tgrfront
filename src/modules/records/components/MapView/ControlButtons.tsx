import { useAbility } from "@casl/react";
import React from "react";
import { Button } from "react-bootstrap";
import {
  CheckLg as SubmitIcon,
  PinMap as CenterIcon,
  PlusLg as CreateIcon,
  Search as SearchIcon,
  XLg as CancelIcon,
} from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { AbilityContext } from "src/modules/ability/ability";
import { RootState, useAppDispatch } from "src/store";
import {
  resetForm,
  setIsCreationFormShown,
  setIsSelectingSpot,
} from "src/store/createSpot.reducer";
import {
  setCenter,
  setIsAddressSearchShown,
  setZoom,
} from "src/store/map.reducer";
import { Record } from "../../models/record.model";

export function AddressSearchButton() {
  const dispatch = useAppDispatch();
  const { isAddressSearchShown } = useSelector((state: RootState) => state.map);
  return (
    <>
      <Button
        onClick={() => dispatch(setIsAddressSearchShown(!isAddressSearchShown))}
        variant="secondary"
        size="lg"
        className="m-1 map-view__button p-2 rounded-circle"
        title="Поиск по адресу"
      >
        <SearchIcon />
      </Button>
    </>
  );
}

export function CenterButton() {
  const userCoords = useSelector((state: RootState) => state.map.userCoords);
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="info"
      className="map-view__center-button m-1 mb-3 p-2 rounded-circle"
      title="Показать мою локацию на карте"
      onClick={() => {
        if (!userCoords) return;
        dispatch(setCenter(userCoords));
        dispatch(setZoom(10));
      }}
    >
      <CenterIcon />
    </Button>
  );
}

export function ControlButtons() {
  const { isSelectingSpot, selectedSpot } = useSelector(
    (state: RootState) => state.createSpot
  );
  const ability = useAbility(AbilityContext);
  const dispatch = useAppDispatch();

  return (
    <>
      {ability.can("create", Record) && (
        <>
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
                onClick={() => resetForm()}
              >
                <CancelIcon />
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
