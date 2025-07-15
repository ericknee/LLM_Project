import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  const token = localStorage.getItem("access_token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            token
              ? <HomePage jwtToken={token} />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/home" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
