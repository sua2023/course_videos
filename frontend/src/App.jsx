import React from "react";
import {
  BrowserRouter as Router
} from "react-router-dom";
import Login from "./auth/Login";
import Index from "./dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const token = localStorage.getItem("token");
  return (
    <React.Fragment>
      <Router>{token ? <Index /> : <Login />}</Router>
      <ToastContainer />
    </React.Fragment>
  );
}

export default App;
