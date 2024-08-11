import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useUser } from "../contexts/UserContext";

const DashboardPage: React.FC = () => {
  const { user, logout } = useUser();

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.username}
      </Typography>
      <Button variant="contained" color="secondary" onClick={logout}>
        Logout
      </Button>
    </Container>
  );
};

export default DashboardPage;
