import React from 'react';
import { Button } from "react-bootstrap";
import { PinMap as Icon } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/store";
import { setCenter, setZoom } from "src/store/map.reducer";

const CenterButton = () => {
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
      <Icon />
    </Button>
  );
};

export default CenterButton;
