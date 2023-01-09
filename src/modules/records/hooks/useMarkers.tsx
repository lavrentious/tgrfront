import { DragEndEvent } from "leaflet";
import React, { useMemo } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  blueIcon as userSpotIcon,
  greyIcon as recordIcon,
  redIcon as selectedSpotIcon,
} from "src/assets/markerIcons";
import { RootState, useAppDispatch } from "src/store";
import {
  setIsCreationFormShown,
  setSelectedSpot,
} from "src/store/createSpot.reducer";
import { IMarker } from "../components/LeafletMap/LeafletMap";
import { Record } from "../models/record.model";

function RecordMarkerContent(record: Record) {
  return (
    <>
      <p>{record.description ? record.description : <i>Нет описания</i>}</p>
      <Link to={`/record/${record._id}`}>
        <Button>Открыть</Button>
      </Link>
    </>
  );
}

export function recordMarker(record: Record): IMarker {
  return {
    key: record._id,
    icon: recordIcon,
    position: [record.lat, record.lon],
    tooltip: record.name,
    content: RecordMarkerContent(record),
  };
}

export function useMarkers(records: Record[] = []) {
  const { userCoords } = useSelector((state: RootState) => state.map);
  const { selectedSpot } = useSelector((state: RootState) => state.createSpot);
  const dispatch = useAppDispatch();
  return useMemo<IMarker[]>(
    () =>
      records.map(recordMarker).concat([
        {
          key: "userPos",
          visible: userCoords != null,
          position: userCoords,
          icon: userSpotIcon,
          content: <>Вы находитесь здесь</>,
        },
        {
          key: "selectedSpot",
          visible: selectedSpot != null,
          position: selectedSpot,
          icon: selectedSpotIcon,
          draggable: true,
          eventHandlers: {
            dragend(e: DragEndEvent) {
              const { lat, lng } = e.target.getLatLng();
              dispatch(setSelectedSpot([lat, lng]));
            },
          },
          content: (
            <>
              Выбранное место
              <div className="d-flex justify-content-evenly">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => dispatch(setSelectedSpot(null))}
                >
                  Отмена
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => dispatch(setIsCreationFormShown(true))}
                >
                  Создать
                </Button>
              </div>
            </>
          ),
        },
      ]),
    [dispatch, selectedSpot, userCoords]
  );
}
