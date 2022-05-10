import React from "react";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import User from "./pages/User";
import Login from "./pages/Login";
import Detail from "./pages/Detail";
import { OrdersProvider } from "./OrdersContext";
import { AuthTokenProvider } from "./AuthTokenContext";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
      <OrdersProvider>
        <AuthTokenProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<User />} />
            <Route path="/login" element={<Login />} />
            <Route path="/detail/:orderId" element={<Detail />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </Router>
        </AuthTokenProvider>
      </OrdersProvider>
  );
}

export default App;
