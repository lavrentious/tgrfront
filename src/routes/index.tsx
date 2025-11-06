import { lazy } from "react";

export type Route = {
  path: string;
  element: React.ReactNode;
  anonOnly?: boolean;
  authOnly?: boolean;
};

const MainMap = lazy(
  () => import("src/modules/records/components/MapView/MapView"),
);
const About = lazy(() => import("src/modules/about/components/About/About"));
const Login = lazy(() => import("src/modules/users/components/Login/Login"));
const Register = lazy(
  () => import("src/modules/users/components/Register/Register"),
);
const RecordView = lazy(
  () => import("src/modules/records/components/RecordView/RecordView"),
);
const Profile = lazy(
  () => import("src/modules/users/components/Profile/Profile"),
);
const CreatePasswordReset = lazy(
  () =>
    import("src/modules/users/components/ResetPassword/CreatePasswordReset"),
);
const ResetPassword = lazy(
  () => import("src/modules/users/components/ResetPassword/ResetPassword"),
);
const RecordSearch = lazy(
  () => import("src/modules/records/components/Search/RecordSearch"),
);
const UserSearch = lazy(
  () => import("src/modules/users/components/Search/UserSearch"),
);
const NotFound = lazy(
  () => import("src/modules/common/components/NotFound/NotFound"),
);

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
