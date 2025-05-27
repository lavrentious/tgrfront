import { useAbility } from "@casl/react";
import { Button } from "react-bootstrap";
import {
  BsXLg as CancelIcon,
  BsPlusLg as CreateIcon,
  BsSearch as SearchIcon,
  BsCheckLg as SubmitIcon,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { AbilityContext } from "src/modules/ability/ability";
import { type RootState, useAppDispatch } from "src/store";
import {
  resetForm,
  setIsCreationFormShown,
  setIsSelectingSpot,
} from "src/store/createSpot.reducer";
import { setIsAddressSearchShown } from "src/store/map.reducer";
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

export function ControlButtons() {
  const { isSelectingSpot, selectedSpot } = useSelector(
    (state: RootState) => state.createSpot,
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
                onClick={() => dispatch(resetForm())}
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
