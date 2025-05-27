import React from "react";
import About from "src/modules/about/components/About/About";
import NotFound from "src/modules/common/components/NotFound/NotFound";
import MainMap from "src/modules/records/components/MapView/MapView";
import RecordView from "src/modules/records/components/RecordView/RecordView";
import RecordSearch from "src/modules/records/components/Search/RecordSearch";
import Login from "src/modules/users/components/Login/Login";
import Profile from "src/modules/users/components/Profile/Profile";
import Register from "src/modules/users/components/Register/Register";
import CreatePasswordReset from "src/modules/users/components/ResetPassword/CreatePasswordReset";
import ResetPassword from "src/modules/users/components/ResetPassword/ResetPassword";
import UserSearch from "src/modules/users/components/Search/UserSearch";

export type Route = {
  path: string;
  element: React.ReactNode;
  anonOnly?: boolean;
  authOnly?: boolean;
};
const routes: Route[] = [
  { element: <MainMap />, path: "/" },
  { element: <About />, path: "/about" },
  { element: <Login />, path: "/login", anonOnly: true },
  { element: <Register />, path: "/register", anonOnly: true },
  { element: <RecordView />, path: "/record/:id" },
  { element: <Profile />, path: "/profile/:idOrUsername" },
  {
    element: <CreatePasswordReset />,
    path: "/request-password-reset",
    anonOnly: true,
  },
  { element: <ResetPassword />, path: "/reset-password/:key", anonOnly: true },
  { element: <RecordSearch />, path: "/record-search" },
  { element: <UserSearch />, path: "/user-search" },
  { element: <NotFound />, path: "/*" },
];

export default routes;
