import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import Hostelscontextprovider from "./Context/Hostelss.jsx";
import AuthContextProvider from "./Context/auth";

createRoot(document.getElementById("root")).render(


  <BrowserRouter>
  <AuthContextProvider>

  <Hostelscontextprovider>

    <App />
  </Hostelscontextprovider>
  </AuthContextProvider>
  </BrowserRouter>
);
