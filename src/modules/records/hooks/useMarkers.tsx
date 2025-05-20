import type { DragEndEvent, LatLngTuple } from "leaflet";
import { useMemo } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  yellowIcon as ownRecordIcon,
  greyIcon as recordIcon,
  redIcon as selectedSpotIcon,
} from "src/assets/markerIcons";
import { type RootState, useAppDispatch } from "src/store";
import {
  setIsCreationFormShown,
  setSelectedSpot,
} from "src/store/createSpot.reducer";
import type { IMarker } from "../components/LeafletMap/LeafletMap";
import { Record } from "../models/record.model";

function RecordMarkerContent(record: Record) {
  let description = <></>;
  if (!record.description) description = <i>Нет описания</i>;
  else if (record.description.length > 500)
    description = <p>{record.description.slice(0, 500)}...</p>;
  else description = <p>{record.description}</p>;
  return (
    <>
      {description}
      <Link to={`/record/${record._id}`}>
        <Button>Открыть</Button>
      </Link>
    </>
  );
}

export function recordMarker(record: Record, icon = recordIcon): IMarker {
  return {
    key: record._id,
    icon,
    position: [record.lat, record.lon],
    tooltip: record.name,
    content: RecordMarkerContent(record),
  };
}

export function useMarkers(
  records: Record[] = [],
  selectedSpot?: LatLngTuple | null,
) {
  const dispatch = useAppDispatch();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  return useMemo<IMarker[]>(() => {
    const markers = records.map((r) =>
      recordMarker(
        r,
        r.author._id === loggedUser?.id ? ownRecordIcon : recordIcon,
      ),
    );
    if (selectedSpot) {
      markers.push({
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
      });
    }
    return markers;
  }, [dispatch, selectedSpot, records, loggedUser]);
}
