import React from "react";

const LeafletAttribution = () => {
  return (
    <div className="leaflet-map__attribution">
      <a
        href="https://leafletjs.com"
        title="A JavaScript library for interactive maps"
      >
        Leaflet
      </a>{" "}
      | &copy;
      <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>{" "}
      contributors | &copy;
      <a href="https://nominatim.org">Nominatim</a>
    </div>
  );
};

export default LeafletAttribution;
