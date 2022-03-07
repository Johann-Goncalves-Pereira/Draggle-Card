import React from "react";
import ReactDOM from "react-dom";
import Home from "./App/Pages/Home/Home";
import "./Styles/_reset.scss";
import "./Styles/_base.scss";

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById("root")
);
