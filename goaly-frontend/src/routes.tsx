import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NewDashboardPage from "./pages/NewDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <NewDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
