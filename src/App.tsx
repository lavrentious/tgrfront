import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Provider } from "react-redux";
import "./app.css";
import AppRouter from "./modules/common/components/AppRouter";
import Navbar from "./modules/common/components/Navbar/Navbar";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <AppRouter>
        <Navbar />
      </AppRouter>
    </Provider>
  );
};

export default App;
