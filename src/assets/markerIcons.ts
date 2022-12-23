import { Icon } from "leaflet";

import black from "./markers/marker-icon-2x-black.png";
import blue from "./markers/marker-icon-2x-blue.png";
import gold from "./markers/marker-icon-2x-gold.png";
import green from "./markers/marker-icon-2x-green.png";
import grey from "./markers/marker-icon-2x-grey.png";
import orange from "./markers/marker-icon-2x-orange.png";
import red from "./markers/marker-icon-2x-red.png";
import violet from "./markers/marker-icon-2x-violet.png";
import yellow from "./markers/marker-icon-2x-yellow.png";
import shadow from "./markers/marker-shadow.png";

const getIcon = (iconUrl: string) =>
  new Icon({
    iconUrl,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

export const blueIcon = getIcon(blue);
export const goldIcon = getIcon(gold);
export const redIcon = getIcon(red);
export const greenIcon = getIcon(green);
export const orangeIcon = getIcon(orange);
export const yellowIcon = getIcon(yellow);
export const violetIcon = getIcon(violet);
export const greyIcon = getIcon(grey);
export const blackIcon = getIcon(black);
