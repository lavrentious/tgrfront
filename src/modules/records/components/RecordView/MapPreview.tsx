import { useAbility } from "@casl/react";
import type { LatLngTuple } from "leaflet";
import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  BsXLg as CancelIcon,
  BsPencil as EditIcon,
  BsSave as SaveIcon,
} from "react-icons/bs";
import { greenIcon as recordIcon } from "src/assets/markerIcons";
import { AbilityContext } from "src/modules/ability/ability";
import { Record } from "src/modules/records/models/record.model";
import { useAppDispatch } from "src/store";
import { setIsAddressSearchShown } from "src/store/map.reducer";
import { useUpdateRecordMutation } from "../../api/records.api";
import { createRecord } from "../../utils";
import AddressSearchModal from "../AddressSearch/AddressSearchModal";
import CenterButton from "../LeafletMap/CenterButton";
import LeafletMap, { type IMarker } from "../LeafletMap/LeafletMap";
import { AddressSearchButton } from "../MapView/ControlButtons";

interface MapPreviewProps {
  record: Record;
}

const EditButton: React.FC<{
  record: Record;
  active: boolean;
  setActive: (active: boolean) => void;
  marker: IMarker;
  onSave: () => void;
}> = ({ record, active, setActive, marker, onSave }) => {
  const ability = useAbility(AbilityContext);
  if (!ability.can("update", createRecord(record))) return <></>;
  if (active) {
    return (
      <>
        <Button
          className="my-1 me-1"
          variant="danger"
          onClick={() => {
            setActive(false);
            marker.position = [record.lat, record.lon];
            marker.draggable = false;
          }}
        >
          <CancelIcon /> Отмена
        </Button>
        <Button
          className="my-1 me-1"
          variant="success"
          onClick={() => {
            marker.draggable = false;
            setActive(false);
            onSave();
          }}
        >
          <SaveIcon /> Сохранить
        </Button>
      </>
    );
  }
  return (
    <Button
      className="my-1 me-1"
      variant="secondary"
      onClick={() => {
        setActive(true);
        marker.draggable = true;
      }}
    >
      <EditIcon /> Изменить положение
    </Button>
  );
};

const MapPreview: React.FC<MapPreviewProps> = ({ record }) => {
  const [zoom, setZoom] = useState<number>(12);
  const [center, setCenter] = useState<LatLngTuple>([record.lat, record.lon]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [autoAddress, setAutoAddress] = useState<boolean>(true);
  const marker = useRef<IMarker>({
    position: [record.lat, record.lon],
    key: record._id,
    icon: recordIcon,
    content: record.name,
    draggable: false,
    eventHandlers: {
      dragend(e) {
        const { lat, lng } = e.target.getLatLng();
        marker.current.position = [lat, lng];
      },
    },
  });
  const dispatch = useAppDispatch();

  const [updateRecord] = useUpdateRecordMutation();

  const save = () => {
    if (marker.current.position == null) return;
    const [lat, lon] = marker.current.position;
    updateRecord({ id: record._id, dto: { lat, lon, autoAddress } }).then(() =>
      toast.success("Положение изменено"),
    );
  };
  const select = (lat: number, lng: number) => {
    marker.current.position = [lat, lng];
    setCenter([lat, lng]);
    setZoom(15);
    dispatch(setIsAddressSearchShown(false));
  };

  return (
    <>
      <EditButton
        record={record}
        active={editMode}
        marker={marker.current}
        setActive={setEditMode}
        onSave={save}
      />
      {editMode && (
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Автоматически определить и обновить адрес"
            checked={autoAddress}
            onChange={(e) => setAutoAddress(e.target.checked)}
          />
        </Form.Group>
      )}
      <AddressSearchModal select={select} />
      <LeafletMap
        style={{ height: "40rem" }}
        center={center}
        zoom={zoom}
        setCenter={setCenter}
        setZoom={setZoom}
        markers={[marker.current]}
        btnBlockChildren={
          <>
            {editMode && <AddressSearchButton />}
            <CenterButton
              style={{ fontSize: "x-large", lineHeight: 0 }}
              variant="success"
              setCenter={() => {
                setCenter([record.lat, record.lon]);
                setZoom(15);
              }}
            />
          </>
        }
      />
    </>
  );
};

export default MapPreview;
