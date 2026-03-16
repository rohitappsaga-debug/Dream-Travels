import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import Admin from "./Admin/Admin";
import reportWebVitals from "./reportWebVitals";
import Book from "./componet/Book";
import Package from "./componet/Package";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <App />
      {/* <Admin /> */}
    </Router>
  </React.StrictMode>
);

reportWebVitals();
