import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import { makeServer } from "./mirage/server";
import './index.css';
import App from "./App";

// if (process.env.NODE_ENV === "development") {
// }
makeServer();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
