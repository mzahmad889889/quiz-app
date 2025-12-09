import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import QuizDashboard from "./components/StudentDashboard";
import HomePage from "./components/HomePage";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import { UserProvider } from "./components/UserContext";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/dashboard" element={<QuizDashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
