import type { LatLngTuple } from "leaflet";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import AddressSearchModal from "src/modules/records/components/AddressSearch/AddressSearchModal";
import CreateSpotModal from "src/modules/records/components/CreateSpot/CreateSpotModal";
import LeafletMap from "src/modules/records/components/LeafletMap/LeafletMap";
import {
  AddressSearchButton,
  ControlButtons,
} from "src/modules/records/components/MapView/ControlButtons";
import { type RootState, useAppDispatch } from "src/store";
import {
  setIsSelectingSpot,
  setSelectedSpot,
} from "src/store/createSpot.reducer";
import {
  setCenter as setCenterAction,
  setZoom as setZoomAction,
} from "src/store/map.reducer";
import { useGetRecordsQuery } from "../../api/records.api";
import { useMarkers } from "../../hooks/useMarkers";
import "./mapView.css";

const MainMap: React.FunctionComponent = () => {
  const { zoom, center } = useSelector((state: RootState) => state.map);
  const { isSelectingSpot, selectedSpot } = useSelector(
    (state: RootState) => state.createSpot,
  );
  const dispatch = useAppDispatch();

  const { data: records } = useGetRecordsQuery();
  const markers = useMarkers(records?.docs || [], selectedSpot);

  const setCenter = useCallback(
    (latLng: LatLngTuple) => {
      dispatch(setCenterAction(latLng));
    },
    [dispatch],
  );
  const setZoom = useCallback(
    (zoom: number) => {
      dispatch(setZoomAction(zoom));
    },
    [dispatch],
  );

  return (
    <>
      <LeafletMap
        className="map-view__container"
        center={center}
        zoom={zoom}
        setCenter={setCenter}
        setZoom={setZoom}
        onMapClick={(e) => {
          if (isSelectingSpot) {
            const { lat, lng } = e.latlng;
            dispatch(setSelectedSpot([lat, lng]));
            dispatch(setIsSelectingSpot(false));
          }
        }}
        markers={markers}
        recenter={true}
        btnBlockChildren={
          <>
            <AddressSearchButton />
            <ControlButtons />
          </>
        }
      />
      <AddressSearchModal />
      <CreateSpotModal />
    </>
  );
};

export default MainMap;
