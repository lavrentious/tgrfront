import useGeolocationState from "beautiful-react-hooks/useGeolocationState";
import { LatLngTuple } from "leaflet";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import AddressSearchModal from "src/modules/records/components/AddressSearch/AddressSearchModal";
import CreateSpotModal from "src/modules/records/components/CreateSpot/CreateSpotModal";
import LeafletMap from "src/modules/records/components/LeafletMap/LeafletMap";
import {
  AddressSearchButton,
  CenterButton,
  ControlButtons,
} from "src/modules/records/components/MapView/ControlButtons";
import { RootState, useAppDispatch } from "src/store";
import {
  setIsSelectingSpot,
  setSelectedSpot,
} from "src/store/createSpot.reducer";
import { setCenter, setUserCoords, setZoom } from "src/store/map.reducer";
import { useMarkers } from "../../hooks/useMarkers";
import { Record } from "../../models/record.model";
import { RecordsService } from "../../services/records.service";
import "./mapView.css";

let init = true;

const MainMap: React.FunctionComponent = () => {
  const { zoom, center, userCoords } = useSelector(
    (state: RootState) => state.map
  );
  const { isSelectingSpot } = useSelector(
    (state: RootState) => state.createSpot
  );
  const dispatch = useAppDispatch();

  const { position, onError } = useGeolocationState();
  onError((e) => {
    switch (e.code) {
      case e.PERMISSION_DENIED:
        toast.error("Вы запретили доступ к своему местоположению.");
        break;
      default:
        toast.error("Невозможно получить местоположение.");
        break;
    }
  });

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
  const [records, setRecords] = useState<Record[]>([]);
  useEffect(() => {
    RecordsService.findAll().then(setRecords);
    return () => {
      // TODO: various optimizations
      console.log("unmounted");
    };
  }, []);

  const markers = useMarkers(records);

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
      <div className="map-view__buttons">
        <AddressSearchButton />
        <ControlButtons />
      </div>
      {userCoords && <CenterButton />}
      <AddressSearchModal />
      <CreateSpotModal />
    </>
  );
};

export default MainMap;
