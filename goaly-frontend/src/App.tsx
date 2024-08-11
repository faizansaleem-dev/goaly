import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { UserProvider } from "./contexts/UserContext";
import AppRoutes from "./routes"; // Import the routes

const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <CssBaseline />
        <AppRoutes /> {/* Use the AppRoutes component */}
      </UserProvider>
    </Router>
  );
};

export default App;
