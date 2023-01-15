import React from "react";
import About from "src/modules/about/components/About/About";
import NotFound from "src/modules/common/components/NotFound/NotFound";
import MainMap from "src/modules/records/components/MapView/MapView";
import RecordView from "src/modules/records/components/RecordView/RecordView";
import Login from "src/modules/users/components/Login/Login";
import Register from "src/modules/users/components/Register/Register";

export type Route = {
  path: string;
  element: React.ReactNode;
  anonOnly?: boolean;
  authOnly?: boolean;
};
const routes: Route[] = [
  { element: <MainMap />, path: "/map" },
  { element: <About />, path: "/" },
  { element: <Login />, path: "/login", anonOnly: true },
  { element: <Register />, path: "/register", anonOnly: true },
  { element: <RecordView />, path: "/record/:id" },
  { element: <NotFound />, path: "/*" },
];

export default routes;
