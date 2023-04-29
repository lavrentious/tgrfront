import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddressSearchModal from "src/modules/records/components/AddressSearch/AddressSearchModal";
import CreateSpotModal from "src/modules/records/components/CreateSpot/CreateSpotModal";
import LeafletMap from "src/modules/records/components/LeafletMap/LeafletMap";
import {
  AddressSearchButton,
  ControlButtons,
} from "src/modules/records/components/MapView/ControlButtons";
import { RootState, useAppDispatch } from "src/store";
import {
  setIsSelectingSpot,
  setSelectedSpot,
} from "src/store/createSpot.reducer";
import { setCenter, setZoom } from "src/store/map.reducer";
import { useMarkers } from "../../hooks/useMarkers";
import { Record } from "../../models/record.model";
import { RecordsService } from "../../services/records.service";
import "./mapView.css";

const MainMap: React.FunctionComponent = () => {
  const { zoom, center } = useSelector((state: RootState) => state.map);
  const { isSelectingSpot, selectedSpot } = useSelector(
    (state: RootState) => state.createSpot
  );
  const dispatch = useAppDispatch();

  const [records, setRecords] = useState<Record[]>([]);
  useEffect(() => {
    RecordsService.findAll().then((res) => setRecords(res.docs));
    return () => {
      // TODO: various optimizations
    };
  }, []);

  const markers = useMarkers(records, selectedSpot);

  return (
    <>
      <LeafletMap
        className="map-view__container"
        center={center}
        zoom={zoom}
        setCenter={(latLng) => dispatch(setCenter(latLng))}
        setZoom={(zoom) => dispatch(setZoom(zoom))}
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
