import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import AdminDashboard from "./components/AdminDashboard";
import StudentDetails from "./pages/StudentDetails";
import Questions from "./pages/Questions";
import AddedQuizQuestions from "./pages/AddedQuizQuestions";
import AllocateQuiz from "./pages/AllocateQuiz";
import StudentQuizHistory from "./pages/StudentQuizHistory";

import StudentDashboard from "./components/StudentDashboard";
// import AllocateQuiz from "./pages/AllocateQuiz";
import Profile from "./pages/Profile";
import QuizHistory from "./pages/QuizHistory";

import { UserProvider } from "./components/UserContext";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registration" element={<RegistrationForm />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>

            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<div />} />
              <Route path="students" element={<StudentDetails />} />
              <Route path="questions" element={<Questions />} />
              <Route path="assign" element={<AllocateQuiz />} />
              <Route path="quiz-questions" element={<AddedQuizQuestions />} />
              <Route path="history" element={<StudentQuizHistory />} />
            </Route>

            {/* STUDENT Dashboard Routes */}
            <Route path="/student" element={<StudentDashboard />}>
              <Route index element={<div />} />
              <Route path="dashboard" element={<div />} />
              <Route path="profile" element={<Profile />} />
              <Route path="history" element={<QuizHistory />} />
              <Route path="quizzes" element={<div />} />
            </Route>

          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
