import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import Modal from "react-modal";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

Modal.setAppElement("#root");
