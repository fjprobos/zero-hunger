import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById("root"));

const requestedScopes = [
  "edit:user",
  "edit:order",
  "write:history",
  "read:history"
];
//scope={requestedScopes.join(" ")}


root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={`${window.location.origin}/home`}
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
  >
    <App />
  </Auth0Provider>
);
