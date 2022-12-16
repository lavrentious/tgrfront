import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import routes from "src/routes";

interface AppRouterProps {
  children: React.ReactNode;
}

const AppRouter: React.FC<AppRouterProps> = ({ children }) => {
  const isLoggedIn = false; // TODO
  return (
    <BrowserRouter>
      {children}
      <Routes>
        {routes.map((route) => {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                (!route.anonOnly && !route.authOnly) ||
                (route.anonOnly && !isLoggedIn) ||
                (route.authOnly && isLoggedIn) ? (
                  route.element
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
