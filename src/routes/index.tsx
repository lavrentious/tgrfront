import React from "react";
import About from "src/modules/about/components/About/About";
import MainMap from "src/modules/records/components/MapView/MapView";
import NotFound from "src/modules/common/components/NotFound/NotFound";

export type Route = {
  path: string;
  element: React.ReactNode;
  anonOnly?: boolean;
  authOnly?: boolean;
};
const routes: Route[] = [
  { element: <MainMap />, path: "/map" },
  { element: <About />, path: "/" },
  { element: <NotFound />, path: "/*" },
];

export default routes;
