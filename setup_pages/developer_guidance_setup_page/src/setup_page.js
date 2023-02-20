import React from "react";
import { createRoot } from "react-dom/client";
import myApp from "./views/setup_page_example"; // app entry-point file

createRoot(document.getElementById("main_container")).render(
  React.createElement(myApp)
);