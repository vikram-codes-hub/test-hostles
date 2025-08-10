import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import Hostelscontextprovider from "./Context/Hostelss.jsx";
import AuthContextProvider from "./Context/auth.jsx";
import ChatContextProvider from "./Context/Chatcontext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Hostelscontextprovider>
          <ChatContextProvider>

            <App />
          </ChatContextProvider>
         
        </Hostelscontextprovider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
