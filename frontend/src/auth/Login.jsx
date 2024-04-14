import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    };
    fetch("http://localhost:5000/api/auth", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error");
        }
        return response.json();
      })
      .then((result) => {
        if (result.status == 200) {
          const decoded = jwtDecode(result.token);
          console.log(decoded);
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(decoded));
          location.reload();
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Paper sx={{ maxWidth: "400px", mt: 5 }} elevation={1}>
          <Typography variant="h4" sx={{ pt: 2, textAlign: "center" }}>
            Login
          </Typography>
          <Box sx={{ p: 5 }} component="form" onSubmit={handleSubmit}>
            <Typography textAlign="start">Email</Typography>
            <TextField
              fullWidth
              sx={{ mb: 2 }}
              variant="outlined"
              type="text"
              placeholder="Username or email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <Typography textAlign="start">Password</Typography>
            <TextField
              fullWidth
              sx={{ mb: 2 }}
              variant="outlined"
              type="passowrd"
              placeholder="*******"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <Button fullWidth variant="contained" type="submit" color="success">
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default Login;
