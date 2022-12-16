import useGeolocationState from "beautiful-react-hooks/useGeolocationState";
import { DragEndEvent, LatLngTuple } from "leaflet";
import * as React from "react";
import { useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  blueIcon as userSpotIcon,
  redIcon as selectedSpotIcon,
} from "src/assets/markerIcons";
import AddressSearchModal from "src/modules/records/components/AddressSearch/AddressSearchModal";
import CreateSpotModal from "src/modules/records/components/CreateSpot/CreateSpotModal";
import LeafletMap, {
  IMarker,
} from "src/modules/records/components/LeafletMap/LeafletMap";
import CenterButton from "src/modules/records/components/MapView/CenterButton";
import ControlButtons from "src/modules/records/components/MapView/ControlButtons";
import { RootState, useAppDispatch } from "src/store";
import { setIsCreationFormShown } from "src/store/createSpot.reducer";
import {
  setCenter,
  setIsSelectingSpot,
  setSelectedSpot,
  setUserCoords,
  setZoom,
} from "src/store/map.reducer";
import "./mapView.css";

let init = true;

const MainMap: React.FunctionComponent = () => {
  const { zoom, center, userCoords, selectedSpot, isSelectingSpot } =
    useSelector((state: RootState) => state.map);
  const dispatch = useAppDispatch();

  const { position } = useGeolocationState();

  useEffect(() => {
    if (position?.coords) {
      const coords: LatLngTuple = [
        position.coords.latitude,
        position.coords.longitude,
      ];
      dispatch(setUserCoords(coords));
      if (init) {
        dispatch(setCenter(coords));
        init = false;
      }
    }
  }, [dispatch, position]);
  useEffect(() => {
    return () => {
      // TODO: various optimizations
      console.log("unmounted");
    };
  }, []);

  const markers = useMemo<IMarker[]>(
    () => [
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
    ],
    [dispatch, selectedSpot, userCoords]
  );

  return (
    <>
      <LeafletMap
        className="map-view__container"
        center={center}
        zoom={zoom}
        setCenter={(latLng) => dispatch(setCenter(latLng))}
        setZoom={(zoom) => dispatch(setZoom(zoom))}
        onClick={(e) => {
          if (isSelectingSpot) {
            const { lat, lng } = e.latlng;
            dispatch(setSelectedSpot([lat, lng]));
            dispatch(setIsSelectingSpot(false));
          }
        }}
        markers={markers}
      />
      <ControlButtons />
      <AddressSearchModal />
      <CreateSpotModal />
      {userCoords && <CenterButton />}
    </>
  );
};

export default MainMap;
