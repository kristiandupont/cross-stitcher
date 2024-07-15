import "./index.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Geiger } from "react-geiger";

import App from "./App";

function assertTruthy<T>(value: T | null | undefined): asserts value is T {
  if (!value) {
    throw new Error("Expected value to be truthy");
  }
}

async function main() {
  const root = document.querySelector("#root");
  assertTruthy(root);

  ReactDOM.createRoot(root).render(
    <StrictMode>
      <Geiger
        renderTimeThreshold={50}
        enabled={(import.meta as any).env.MODE === "development"}
      >
        <App />
      </Geiger>
    </StrictMode>
  );
}

main();
