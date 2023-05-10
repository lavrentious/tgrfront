// react leaflet seems to have huge problems with typing

import useGeolocationState from "beautiful-react-hooks/useGeolocationState";
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
import { toast } from "react-hot-toast";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import { useSelector } from "react-redux";
import { blueIcon as userSpotIcon } from "src/assets/markerIcons";
import arraysEqual from "src/modules/common/utils/arraysEqual";
import { RootState, useAppDispatch } from "src/store";
import { setUserCoords } from "src/store/map.reducer";
import CenterButton from "./CenterButton";
import LeafletAttribution from "./LeafletAttribution";

export interface IMarker {
  position: LatLngTuple | null;
  icon: Icon;
  key: React.Key;
  draggable?: boolean;
  eventHandlers?: LeafletEventHandlerFnMap;
  content?: React.ReactNode;
  visible?: boolean;
  tooltip?: string | React.ReactNode;
}

interface ILeafletMapProps extends React.HTMLProps<HTMLDivElement> {
  center: LatLngTuple;
  setCenter?: (latLng: LatLngTuple) => void;
  zoom: number;
  setZoom?: (zoom: number) => void;
  className?: string;
  onMapClick?: (e: LeafletMouseEvent) => void;
  markers?: IMarker[];
  children?: React.ReactNode;
  userCoords?: LatLngTuple | null;
  setUserCoords?: (latLng: LatLngTuple) => void;
  btnBlockChildren?: React.ReactNode;
  recenter?: boolean;
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
  onMapClick,
  setCenter,
  setZoom,
}: {
  onMapClick: ((e: LeafletMouseEvent) => void) | undefined;
  setCenter: ((latLng: LatLngTuple) => void) | undefined;
  setZoom: ((zoom: number) => void) | undefined;
}) => {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e);
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

export function markerFromData(marker: IMarker): React.ReactNode {
  if (!marker.position || marker.visible === false) return <></>;
  return (
    <Marker {...marker} position={marker.position}>
      {marker.content ? <Popup>{marker.content}</Popup> : <></>}
      {marker.tooltip && <Tooltip>{marker.tooltip}</Tooltip>}
    </Marker>
  );
}

const LeafletMap: React.FunctionComponent<ILeafletMapProps> = memo(
  function LeafletMap({
    center,
    setCenter,
    zoom,
    setZoom,
    onMapClick,
    children,
    markers,
    btnBlockChildren,
    recenter,
    ...props
  }: ILeafletMapProps) {
    const map = useRef<Map | null>(null);
    const init = useRef<boolean>(true);
    const dispatch = useAppDispatch();
    const { userCoords } = useSelector((state: RootState) => state.map);

    useEffect(() => {
      if (!map.current) return;
      const { lat: mapLat, lng: mapLng } = map.current.getCenter();
      const mapCenter: LatLngTuple = [mapLat, mapLng];
      const mapZoom = map.current.getZoom();
      if (!arraysEqual(center, mapCenter) || zoom !== mapZoom) {
        centerOn(map, center, zoom);
      }
    }, [center, zoom]);

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
        if (recenter && init.current && setCenter) {
          setCenter(coords);
          init.current = false;
        }
      }
    }, [position]);

    return (
      <div className="leaflet-map__container" {...props}>
        <MapContainer
          className="leaflet-map__map-container"
          center={center ?? [0, 0]}
          zoom={zoom ?? 8}
          // @ts-expect-error target actually exists
          whenReady={({ target }) => {
            map.current = target;
          }}
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {(setZoom || setCenter) && (
            <EventHandlers {...{ onMapClick, setCenter, setZoom }} />
          )}
          {markers?.map((marker) => (
            <React.Fragment key={marker.key}>
              {marker.position != null && marker.visible !== false ? (
                markerFromData(marker)
              ) : (
                <></>
              )}
            </React.Fragment>
          ))}
          {userCoords &&
            markerFromData({
              key: "userPos",
              visible: userCoords != null,
              position: userCoords,
              icon: userSpotIcon,
              tooltip: <>Ваше местоположение</>,
            })}
          {children}
        </MapContainer>
        <LeafletAttribution />
        <div className="leaflet-map__buttons">{btnBlockChildren}</div>
        {userCoords && setCenter && setZoom && (
          <CenterButton
            className="leaflet-map__center-button"
            setCenter={() => {
              setCenter(userCoords);
              setZoom(14);
            }}
          />
        )}
      </div>
    );
  }
);

export default LeafletMap;
