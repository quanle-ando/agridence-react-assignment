import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router";
import routerConfig from "./router/router.config";
import { startMsw } from "./msw/msw";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

startMsw().then(() => {
  root.render(
    <React.StrictMode>
      <RouterProvider router={routerConfig} />
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
