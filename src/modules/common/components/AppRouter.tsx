import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import routes, { type Route as RouteType } from "src/routes";
import type { RootState } from "src/store";
import type { StoredUser } from "src/store/auth.reducer";

interface AppRouterProps {
  children: React.ReactNode;
}

function getRouteElement(
  route: RouteType,
  user: StoredUser | null,
  isAuthLoading: boolean,
): React.ReactNode {
  const isLoggedIn = user != null;
  if (!route.anonOnly && !route.authOnly) return route.element;
  if ((route.anonOnly && !isLoggedIn) || (route.authOnly && isLoggedIn)) {
    return isAuthLoading ? <></> : route.element;
  }
  return <Navigate to="/" />;
}

const AppRouter: React.FC<AppRouterProps> = ({ children }) => {
  const { user, isAuthLoading } = useSelector((state: RootState) => state.auth);
  return (
    <BrowserRouter>
      {children}
      <Routes>
        {routes.map((route) => {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={getRouteElement(route, user, isAuthLoading)}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
