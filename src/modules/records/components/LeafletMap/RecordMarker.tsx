import { Marker, Popup, Tooltip } from "react-leaflet";
import type { IMarker } from "./LeafletMap";

type RecordMarkerProps = {
  marker: IMarker;
};
const RecordMarker: React.FC<RecordMarkerProps> = ({ marker }) => {
  if (!marker.position || marker.visible === false) return <></>;
  return (
    <Marker {...marker} key={marker.key} position={marker.position}>
      {marker.content ? <Popup>{marker.content}</Popup> : <></>}
      {marker.tooltip && <Tooltip>{marker.tooltip}</Tooltip>}
    </Marker>
  );
};

export default RecordMarker;
