import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import "./app.css";
import AbilityContextProvider from "./modules/ability/ability.context.provider";
import AppRouter from "./modules/common/components/AppRouter";
import Navbar from "./modules/common/components/Navbar/Navbar";
import { AuthService } from "./modules/users/services/auth.service";
import store from "./store";

const App = () => {
  useEffect(() => {
    AuthService.onLoad();
  }, []);
  return (
    <Provider store={store}>
      <AbilityContextProvider>
        <AppRouter>
          <Navbar />
          <Toaster position="top-right" />
        </AppRouter>
      </AbilityContextProvider>
    </Provider>
  );
};

export default App;
