import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { config } from "./Example";

const game = new Phaser.Game(config);

// Main app
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
