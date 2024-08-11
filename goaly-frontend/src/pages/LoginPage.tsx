import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useUser } from "../contexts/UserContext";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { login, loading, error } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(username, password);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <Box mt={2}>
          <Typography>
            Don't have an account? <Link to={"/register"}>Register Here</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
