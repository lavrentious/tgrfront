import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import "./app.css";
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
      <AppRouter>
        <Navbar />
        <Toaster position="top-right" />
      </AppRouter>
    </Provider>
  );
};

export default App;
