// react leaflet seems to have huge problems with typing

import {
  Icon,
  LatLngTuple,
  LeafletEventHandlerFnMap,
  LeafletMouseEvent,
  Map,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import * as React from "react";
import { memo, RefObject, useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import arraysEqual from "src/modules/common/utils/arraysEqual";

export interface IMarker {
  position: LatLngTuple | null;
  icon: Icon;
  key: React.Key;
  draggable?: boolean;
  eventHandlers?: LeafletEventHandlerFnMap;
  content?: React.ReactNode;
  visible?: boolean;
}

interface ILeafletMapProps {
  center: LatLngTuple;
  setCenter?: (latLng: LatLngTuple) => void;
  zoom: number;
  setZoom?: (zoom: number) => void;
  className?: string;
  onClick?: (e: LeafletMouseEvent) => void;
  markers?: IMarker[];
  children?: React.ReactNode;
}

const centerOn = (
  map: RefObject<Map | null>,
  center: LatLngTuple,
  zoom: number
) => {
  if (!map.current) return;
  map.current.setView(center, zoom, {
    animate: false,
    duration: 0,
  });
};

const EventHandlers = ({
  onClick,
  setCenter,
  setZoom,
}: {
  onClick: ((e: LeafletMouseEvent) => void) | undefined;
  setCenter: ((latLng: LatLngTuple) => void) | undefined;
  setZoom: ((zoom: number) => void) | undefined;
}) => {
  useMapEvents({
    click(e) {
      if (onClick) onClick(e);
    },
    dragend(e) {
      if (setCenter) {
        setCenter([e.target.getCenter().lat, e.target.getCenter().lng]);
      }
    },
    zoom(e) {
      if (setZoom) setZoom(e.target.getZoom());
      if (setCenter)
        setCenter([e.target.getCenter().lat, e.target.getCenter().lng]);
    },
  });
  return <></>;
};

const LeafletMap: React.FunctionComponent<ILeafletMapProps> = memo(
  function LeafletMap({
    center,
    setCenter,
    zoom,
    setZoom,
    className,
    onClick,
    children,
    markers,
  }: ILeafletMapProps) {
    const map = useRef<Map | null>(null);
    useEffect(() => {
      if (!map.current) return;
      const { lat: mapLat, lng: mapLng } = map.current.getCenter();
      const mapCenter: LatLngTuple = [mapLat, mapLng];
      const mapZoom = map.current.getZoom();
      if (!arraysEqual(center, mapCenter) || zoom !== mapZoom) {
        centerOn(map, center, zoom);
      }
    }, [center, zoom]);

    return (
      <MapContainer
        className={className ?? ""}
        center={center ?? [0, 0]}
        zoom={zoom ?? 8}
        // @ts-expect-error target actually exists
        whenReady={({ target }) => {
          map.current = target;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(setZoom || setCenter) && (
          <EventHandlers {...{ onClick, setCenter, setZoom }} />
        )}
        {markers?.map((marker) =>
          marker.position != null && marker.visible ? (
            <Marker {...marker} position={marker.position} key={marker.key}>
              {marker.content ? <Popup>{marker.content}</Popup> : <></>}
            </Marker>
          ) : (
            <></>
          )
        )}

        {children}
      </MapContainer>
    );
  }
);

export default LeafletMap;
