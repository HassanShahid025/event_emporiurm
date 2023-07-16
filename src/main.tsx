import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { store } from "./redux/store";
import ScrollToTop from "./components/ScrollToTop";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

let persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ScrollToTop />
        <ConfigProvider>
          <PersistGate persistor={persistor}>
            <App />
          </PersistGate>
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
