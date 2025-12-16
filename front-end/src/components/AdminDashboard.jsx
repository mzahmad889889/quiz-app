import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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

const AdminDashboard = () => {
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <AiOutlineDashboard /> },
    { name: "Students", path: "/admin/students", icon: <PiStudent /> },
    { name: "Questions", path: "/admin/questions", icon: <FaRegQuestionCircle /> },
    { name: "Assign Quizes", path: "/admin/assign", icon: <MdOutlineAssignment /> },
    { name: "Quiz Questions", path: "/admin/quiz-questions", icon: <CiBoxList /> },
    { name: "Student Quiz History", path: "/admin/history", icon: <GoHistory /> },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState({
    totalStudents: 0,
    totalAssignedQuizzes: 0,
    totalSubmittedQuizzes: 0,
    totalPendingQuizzes: 0,
  });
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(sessionStorage.getItem("adminUser"));

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("adminUser");
    navigate("/login");
  };

  // Fetch Dashboard Summary
  const fetchSummary = async () => {
    setLoadingSummary(true);
    setSummaryError("");
    try {
      const res = await axios.get("http://localhost:5000/api/admin-dashboard-summary");
      setSummary({
        totalStudents: res.data.totalStudents ?? 0,
        totalAssignedQuizzes: res.data.totalAssignedQuizzes ?? 0,
        totalSubmittedQuizzes: res.data.totalSubmittedQuizzes ?? 0,
        totalPendingQuizzes: res.data.totalPendingQuizzes ?? 0,
      });
    } catch (err) {
      setSummaryError("Failed to load summary");
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const hideSummary =
    location.pathname.includes("students") ||
    location.pathname.includes("questions") ||
    location.pathname.includes("assign") ||
    location.pathname.includes("quiz-questions") ||
    location.pathname.includes("history");

  return (
    <main className="w-screen font-system-ui min-h-screen bg-[#003d39]">
      <MdOutlineMenu
        className="lg:hidden cursor-pointer"
        onClick={() => setSidebarOpen(true)}
      />

      <section className="w-screen text-white flex py-5">
        {/* Sidebar */}
        <section
          className={`w-[18%] lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-[140%]"
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
            />
            <p className="font-bold text-lg capitalize">{`${user.fname} ${user.lname}`}</p>
          </section>

          {/* Nav Items */}
          <section>
            {navItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 p-3 ml-3 cursor-pointer hover:bg-[#003d39] rounded-xl w-[85%]"
                onClick={() => navigate(item.path)}
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

        {/* Main Section */}
        <section className="w-[80%] h-127">

          {/* Dashboard Summary */}
          {/* {hideSummary && ( */}
            <section className="flex w-[95%] bg-[#055e58] rounded-3xl h-35 items-center justify-evenly flex-wrap px-10 mb-8 ml-7">
              <div className="w-70 bg-[#003d39] rounded-3xl shadow-lg p-3 text-3xl">
                <h1 className="text-center">Total Students</h1>
                <div className="flex items-center justify-between mt-8 px-5">
                  <PiStudent className="text-3xl" />
                  <span>{loadingSummary ? "..." : summary.totalStudents}</span>
                </div>
              </div>
              <div className="w-70 bg-[#003d39] rounded-3xl shadow-lg p-3 text-3xl">
                <h1 className="text-center">Total Quizzes</h1>
                <div className="flex items-center justify-between mt-8 px-5">
                  <MdAssignmentAdd className="text-3xl" />
                  <span>{loadingSummary ? "..." : summary.totalAssignedQuizzes}</span>
                </div>
              </div>
              <div className="w-70 bg-[#003d39] rounded-3xl shadow-lg p-3 text-3xl">
                <h1 className="text-center">Pending Quizzes</h1>
                <div className="flex items-center justify-between mt-8 px-5">
                  <MdPendingActions className="text-3xl" />
                  <span>{loadingSummary ? "..." : summary.totalPendingQuizzes}</span>
                </div>
              </div>
            </section>
          {/* )} */}

          {/* Dynamic Child Pages */}
          <section className="w-[95%] bg-[#055e58]  py-5 overflow-y-auto rounded-3xl shadow-lg mx-6 h-[100%]">
            <Outlet />
          </section>
        </section>
      </section>
    </main>
  );
};

export default AdminDashboard;
