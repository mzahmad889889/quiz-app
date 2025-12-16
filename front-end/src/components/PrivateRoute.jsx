import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const student = localStorage.getItem("studentUser");
  const admin = localStorage.getItem("adminUser");

  if (!student && !admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
