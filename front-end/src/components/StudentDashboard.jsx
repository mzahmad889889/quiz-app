import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { PiStudent } from "react-icons/pi";
import { MdOutlineMenu } from "react-icons/md";
import { MdOutlineAssignment } from "react-icons/md";
import { GoHistory } from "react-icons/go";

import axios from "axios";

import Quiz from "../pages/Quiz";
import QuizHistory from "../pages/QuizHistory";

const StudentDashboard = () => {
  const navItems = [
    { name: "Dashboard", path: "dashboard", icon: <AiOutlineDashboard /> },
    { name: "Profile", path: "profile", icon: <PiStudent /> },
    { name: "History", path: "history", icon: <GoHistory /> },
    { name: "Assign Quizzes", path: "quizzes", icon: <MdOutlineAssignment /> },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Get student from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("studentUser"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);

      // set activeSection from URL
      const pathParts = location.pathname.split("/");
      const section = pathParts[2] || "dashboard";
      setActiveSection(section);
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("studentUser");
    navigate("/login");
  };

  // Fetch Assigned Quizzes
  useEffect(() => {
    if (!user) return;
    const fetchAssigned = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/student-assigned/${user.id}`
        );
        setAssignedQuizzes(res.data);
      } catch (error) {
        console.error("Error fetching assigned quizzes", error);
      }
    };

    fetchAssigned();
  }, [user]);

  const startQuiz = async (quiz) => {
    if (!user) return;
    try {
      if (quiz.submitted) {
        alert("You already attempted this quiz.");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/quiz-questions/${quiz.quizId._id}`
      );

      if (!res.data || res.data.length === 0) {
        alert("This quiz has no questions.");
        return;
      }

      setQuestions(res.data);
      setQuizId(quiz.quizId._id);
      setQuizStarted(true);
    } catch (err) {
      console.error("Error loading quiz questions:", err);
    }
  };

  const renderSectionData = () => {
    if (!user) return null;

    if (quizStarted) {
      return <Quiz questions={questions} quizId={quizId} studentId={user.id} />;
    }

    if (activeSection === "profile")
      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p>Name: {user.fname} {user.lname}</p>
          <p>Email: {user.email}</p>
        </div>
      );

      if (activeSection === "history")
        return <QuizHistory studentId={user.id} />;


    if (activeSection === "quizzes") {
      return (
        <div className="p-6 text-white">
          <h1 className="text-2xl font-bold mb-4">Assigned Quizzes</h1>
          {assignedQuizzes.length === 0 ? (
            <p>No quizzes assigned yet.</p>
          ) : (
            <table className="w-[95%] m-auto text-white shadow-xl/30 text-center">
              <thead className="bg-[#003d39] text-white">
                <tr>
                  <th className="p-3">Quiz Title</th>
                  <th className="p-3">Assigned Date</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedQuizzes.map((quiz) => (
                  <tr key={quiz._id}>
                    <td className="p-3">{quiz.quizId?.title}</td>
                    <td className="p-3">{new Date(quiz.assignedAt).toLocaleString()}</td>
                    <td className="p-3">
                      {quiz.submitted ? (
                        <button className="bg-green-400 text-white px-2 py-1 rounded-lg cursor-not-allowed">
                          Attempted
                        </button>
                      ) : (
                        <button
                          className="bg-[#003d39] cursor-pointer text-white px-3 py-1 rounded-lg hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in"
                          onClick={() => startQuiz(quiz)}
                        >
                          Start Quiz
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    }

    // Default dashboard
    return (
      <div className="p-6">
        <h1 className="text-3xl text-white mb-5">Welcome {user.fname} 👋</h1>
        <h1 className="text-2xl mb-4 font-bold text-white">Quiz Rules</h1>
        <ol className="list-decimal text-lg list-inside leading-8 text-white">
          <li>1 minute per question.</li>
          <li>Once you select an answer, it can't be undone.</li>
          <li>Cannot select after time goes off.</li>
          <li>You can't exit quiz while playing.</li>
        </ol>
      </div>
    );
  };

  if (!user) return null;

  return (
    <main className="w-screen font-system-ui min-h-screen bg-[#003d39]">
      <MdOutlineMenu
        className="lg:hidden cursor-pointer"
        onClick={() => setSidebarOpen(true)}
      />

      <section className="w-screen text-white py-5 h-screen flex">
        {/* Sidebar */}
        <section
          className={`w-[18%] h-170 rounded-3xl lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-[140%]"
            } flex flex-col gap-4 bg-[#055e58] pt-6 shadow-lg ml-4`}
        >
          <button
            className="text-xl cursor-pointer ml-3"
            onClick={() => setSidebarOpen(false)}
          >
            X
          </button>

          <section className="h-50 flex flex-col items-center justify-center">
            <img
              src="https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Clipart.png"
              className="w-1/3 pb-2"
              alt="student pic"
            />
            <p className="font-bold text-lg capitalize">
              {user.fname} {user.lname}
            </p>
          </section>

          <section>
            {navItems.map((item) => (
              <div
                key={item.name}
                className={`flex items-center gap-2 p-3 w-[80%] ml-3 mb-3 cursor-pointer rounded-xl hover:bg-[#003d39] ${activeSection === item.path ? "bg-[#003d39]" : ""
                  }`}
                onClick={() => {
                  setActiveSection(item.path);
                  navigate(`/student/${item.path}`);
                }}
              >
                <div className="text-xl">{item.icon}</div>
                <div className="text-xl">{item.name}</div>
              </div>
            ))}
          </section>

          <button
            type="button"
            onClick={handleLogout}
            className="w-25 m-auto mt-12 h-10 cursor-pointer bg-[#003d39] text-white text-lg font-bold rounded-2xl hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in"
          >
            Logout
          </button>
        </section>

        {/* Main Content */}
        <section className="w-[85%] h-170">
          <section className="w-[97%] rounded-3xl h-170 bg-[#055e58] shadow-lg mx-6">
            {renderSectionData()}
          </section>
        </section>
      </section>
    </main>
  );
};

export default StudentDashboard;
