import ReactDOM from "react-dom/client";
import App from "./App";
import { initDayjs } from "./modules/common/utils/initDayjs";

initDayjs();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(<App />);
