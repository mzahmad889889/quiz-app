import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { PiStudent } from "react-icons/pi";
import { FaRegQuestionCircle } from "react-icons/fa";
import { MdOutlineMenu } from "react-icons/md";
import { MdOutlineAssignment } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { GoHistory } from "react-icons/go";
import { MdAssignmentAdd } from "react-icons/md";
import { MdPendingActions } from "react-icons/md";

import axios from "axios";

// Components
import StudentDetails from "../pages/StudentDetails";
import Questions from "../pages/Questions";
import AddedQuizQuestions from "../pages/AddedQuizQuestions";
import AllocateQuizes from "../pages/AllocateQuiz";
import StudentQuizHistory from "../pages/StudentQuizHistory";

const AdminDashboard = () => {
  const navItems = [
    { name: "Dashboard", icon: <AiOutlineDashboard /> },
    { name: "Students", icon: <PiStudent /> },
    { name: "Questions", icon: <FaRegQuestionCircle /> },
    { name: "Assign Quizes", icon: <MdOutlineAssignment /> },
    { name: "Quiz Questions", icon: <CiBoxList /> },
    { name: "Student Quiz History", icon: <GoHistory /> },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [addedQuestions, setAddedQuestions] = useState([]);
  const [summary, setSummary] = useState({
    totalStudents: 0,
    totalAssignedQuizzes: 0,
    totalSubmittedQuizzes: 0,
    totalPendingQuizzes: 0,
  });
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("adminUser")); // ✅ Only admin

  // Redirect if no admin logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  // Fetch summary
  const fetchSummary = async () => {
    setLoadingSummary(true);
    setSummaryError("");
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin-dashboard-summary"
      );
      setSummary({
        totalStudents: res.data.totalStudents ?? 0,
        totalAssignedQuizzes: res.data.totalAssignedQuizzes ?? 0,
        totalSubmittedQuizzes: res.data.totalSubmittedQuizzes ?? 0,
        totalPendingQuizzes: res.data.totalPendingQuizzes ?? 0,
      });
    } catch (err) {
      console.error("Error fetching admin summary:", err);
      setSummaryError("Failed to load summary");
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const renderSectionData = () => {
    if (activeSection === "Students") return <StudentDetails />;
    if (activeSection === "Questions") return <Questions setAddedQuestions={setAddedQuestions} />;
    if (activeSection === "Quiz Questions") return <AddedQuizQuestions addedQuestions={addedQuestions} />;
    if (activeSection === "Assign Quizes") return <AllocateQuizes refreshSummary={fetchSummary} />;
    if (activeSection === "Student Quiz History") return <StudentQuizHistory />;
    return <div className="p-4 text-white">Welcome to Admin Dashboard</div>;
  };

  return (
    <main className="w-screen font-system-ui min-h-screen bg-[#003d39]">
      <MdOutlineMenu
        className="lg:hidden cursor-pointer"
        onClick={() => setSidebarOpen(true)}
      />

      <section className="w-screen text-white flex py-5">
        {/* Sidebar */}
        <section
          className={`w-[18%] lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-[140%]"
          } flex flex-col gap-3 bg-[#055e58] pt-4 rounded-3xl shadow-lg ml-4`}
        >
          <button className="text-xl cursor-pointer ml-3" onClick={() => setSidebarOpen(false)}>
            X
          </button>

          {/* Admin Profile */}
          <section className="h-50 flex mb-4 flex-col items-center justify-center">
            <img
              src="https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Clipart.png"
              className="w-1/3 pb-2"
              alt="admin pic"
            />
            <p className="font-bold text-lg capitalize">{`${user.fname} ${user.lname}`}</p>
          </section>

          {/* Navigation Items */}
          <section>
            {navItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 p-3 ml-3 cursor-pointer hover:bg-[#003d39] rounded-xl w-[85%]"
                onClick={() => setActiveSection(item.name)}
              >
                <div className="text-xl">{item.icon}</div>
                <div className="text-xl">{item.name}</div>
              </div>
            ))}
          </section>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-25 m-auto mb-7 h-10 cursor-pointer bg-[#003d39] text-white text-lg font-bold rounded-2xl hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in"
          >
            Logout
          </button>
        </section>

        {/* Main Content */}
        <section className="w-[80%] h-150">
          {activeSection !== "Quiz Questions" && (
            <section className="flex w-[95%] bg-[#055e58] rounded-3xl h-45 items-center justify-evenly flex-wrap px-10 mb-8 ml-7">
              <div className="w-70 bg-[#003d39] rounded-3xl shadow-lg p-6 text-3xl">
                <h1>Total Students</h1>
                <div className="flex items-center justify-between mt-8">
                  <PiStudent className="text-3xl" />
                  <span>{loadingSummary ? "..." : summary.totalStudents}</span>
                </div>
                {summaryError && <div className="text-sm text-red-400 mt-2">{summaryError}</div>}
              </div>
              <div className="w-70 bg-[#003d39] rounded-3xl shadow-lg p-6 text-3xl">
                <h1>Total Quizzes</h1>
                <div className="flex items-center justify-between mt-8">
                  <MdAssignmentAdd className="text-3xl" />
                  <span>{loadingSummary ? "..." : summary.totalAssignedQuizzes}</span>
                </div>
              </div>
              <div className="w-70 bg-[#003d39] rounded-3xl shadow-lg p-6 text-3xl">
                <h1>Pending Quizzes</h1>
                <div className="flex items-center justify-between mt-8">
                  <MdPendingActions className="text-3xl" />
                  <span>{loadingSummary ? "..." : summary.totalPendingQuizzes}</span>
                </div>
              </div>
            </section>
          )}

          {/* Dynamic Section */}
          <section
            className={`w-[95%] bg-[#055e58] py-5 overflow-y-auto rounded-3xl shadow-lg mx-6 
            ${activeSection === "Quiz Questions" ? "h-170" : "h-117"}`}
          >
            {renderSectionData()}
          </section>
        </section>
      </section>
    </main>
  );
};

export default AdminDashboard;
