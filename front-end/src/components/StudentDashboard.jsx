// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { AiOutlineDashboard } from "react-icons/ai";
// import { LiaChalkboardTeacherSolid } from "react-icons/lia";
// import { PiStudent } from "react-icons/pi";
// import { MdOutlineMenu } from "react-icons/md";
// import Profile from "../pages/Profile";
// import QuizHistory from "../pages/QuizHistory";
// import Quiz from "../pages/Quiz"; 
// import axios from "axios";

// const StudentDashboard = () => {
//   const navItems = [
//     { name: 'Dashboard', icon: <AiOutlineDashboard /> },
//     { name: 'Profile', icon: <PiStudent /> },
//     { name: 'History', icon: <LiaChalkboardTeacherSolid /> },
//     { name: 'Assign Quizes', icon: <LiaChalkboardTeacherSolid /> },
//   ];

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState("Dashboard");
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [questions, setQuestions] = useState([]);
//   const [quizId, setQuizId] = useState(null);

//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));
//   if (!user) { navigate("/login"); return null; }

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   // Start Quiz
//   const startQuiz = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/student-quiz/${user.id}`);
//       const allocatedQuiz = res.data;

//       if (!allocatedQuiz || allocatedQuiz.length === 0) {
//         alert("No quiz allocated yet!");
//         return;
//       }

//       const latestQuiz = allocatedQuiz[0];  
//       if (!latestQuiz.questions || latestQuiz.questions.length === 0) {
//         alert("Allocated quiz has no questions!");
//         return;
//       }

//       setQuestions(latestQuiz.questions);
//       setQuizId(latestQuiz._id);
//       setQuizStarted(true);

//     } catch (err) {
//       console.error("Error fetching allocated quiz:", err);
//     }
//   };

//   const renderSectionData = () => {
//     if (activeSection === "Profile") return <Profile />;
//     else if (activeSection === "History") return <QuizHistory studentId={user.id} />;
//     else {
//       if (quizStarted) return <Quiz questions={questions} quizId={quizId} studentId={user.id} />;
//       return (
//         <section className="rounded-lg px-8 py-4 w-[90%] p-2 h-100">
//           <h1 className="text-2xl mb-4 font-bold text-white">Quiz Rules</h1>
//           <ol className="list-decimal text-lg list-inside leading-8 text-white">
//             <li>1 minute per question.</li>
//             <li>Once you select an answer, it can't be undone.</li>
//             <li>Cannot select after time goes off.</li>
//             <li>You can't exit quiz while playing.</li>
//           </ol>
//           <button
//             className="border-1 cursor-pointer rounded-lg px-3 py-1 mt-3 bg-[#003d39] text-white text-lg font-bold hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in"
//             onClick={startQuiz}
//           >
//             Start Quiz
//           </button>
//         </section>
//       );
//     }
//   };

//   return (
//     <main className="w-screen font-system-ui min-h-screen bg-[#003d39]">
//         <MdOutlineMenu className="lg:hidden cursor-pointer" onClick={() => setSidebarOpen(true)} />
//       {/* Header */}
//       {/* <div className='h-17 bg-white shadow-lg w-[100] px-5 m-auto justify-between flex items-center'>
//         <h1 className='text-2xl text-[#003d39] font-bold font-mono '>Student Dashboard</h1>
//         <div className='flex items-center gap-4'>
//           <button
//             type='button'
//             onClick={handleLogout}
//             className='w-25 h-10 cursor-pointer bg-[#003d39] text-white text-lg font-bold rounded-2xl hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in'
//           >
//             Logout
//           </button>
//         </div>
//       </div> */}

//       {/* Sidebar + Main */}
//       <section className="w-screen text-white flex gap-5">
//         <section className={`w-[20%] lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-[140%]'} flex items-center flex-col gap-4 bg-[#055e58] pt-6 shadow-lg ml-4`}>
//           <button className="text-xl cursor-pointer" onClick={() => setSidebarOpen(false)}>X</button>
//           <section className="h-40 flex items-center flex-col">
//             <img src="https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Clipart.png" className="w-1/3 pb-2" alt="admin pic" />
//             <p className="font-bold text-lg">Student</p>
//           </section>
//           <section className="border-1 h-100">
//             {navItems.map(item => (
//             <div key={item.name} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-[#003d39] rounded-xl"
//                 onClick={() => setActiveSection(item.name)}>
//                 <div className="text-xl">{item.icon}</div>
//                 <div className="text-xl">{item.name}</div>
//               </div>
//             ))}
//           </section>
//           <button
//             type='button'
//             onClick={handleLogout}
//             className='w-25 h-10 mb-5 cursor-pointer bg-[#003d39] text-white text-lg font-bold rounded-2xl hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in'
//           >
//             Logout
//           </button>
//         </section>

//         <section className="w-[90%] h-[100%]">
//           <section className="w-[95%] overflow-y-auto h-screen bg-[#055e58] shadow-lg mx-6">
//             {renderSectionData()}
//           </section>
//         </section>
//       </section>
//     </main>
//   );
// };

// export default StudentDashboard;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiStudent } from "react-icons/pi";
import { MdOutlineMenu } from "react-icons/md";
import Profile from "../pages/Profile";
import QuizHistory from "../pages/QuizHistory";
import Quiz from "../pages/Quiz";
import axios from "axios";

const StudentDashboard = () => {
  const navItems = [
    { name: "Dashboard", icon: <AiOutlineDashboard /> },
    { name: "Profile", icon: <PiStudent /> },
    { name: "History", icon: <LiaChalkboardTeacherSolid /> },
    { name: "Assign Quizes", icon: <LiaChalkboardTeacherSolid /> },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Fetch Assigned Quizzes
  useEffect(() => {
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
  }, [user.id]);

  // Start Quiz
  const startQuiz = async (quiz) => {
    try {
      if (quiz.submitted === true) {
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
    if (quizStarted) {
      return (
        <Quiz
          questions={questions}
          quizId={quizId}
          studentId={user.id}
        />
      );
    }

    if (activeSection === "Profile") {
      return <Profile />;
    }

    if (activeSection === "History") {
      return <QuizHistory studentId={user.id} />;
    }

    if (activeSection === "Assign Quizes") {
      return (
        <div className="p-6 text-white">
          <h1 className="text-2xl font-bold mb-4">Assigned Quizzes</h1>

          {assignedQuizzes.length === 0 ? (
            <p>No quizzes assigned yet.</p>
          ) : (
            <table className="w-full text-white rounded-lg border-1 text-center">
              <thead className="bg-[#003d39] text-white border-1">
                <tr>
                  <th className="p-3">Quiz Title</th>
                  <th className="p-3">Assigned Date</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {assignedQuizzes.map((quiz) => (
                  <tr key={quiz._id} className="border-b">
                    <td className="p-3">{quiz.quizId?.title}</td>

                    <td className="p-3">
                      {new Date(quiz.assignedAt).toLocaleString()}
                    </td>

                    <td className="p-3">
                      {quiz.submitted ? (
                        <button className="bg-green-400 text-white px-4 py-2 rounded-lg cursor-not-allowed">
                          Attempted
                        </button>
                      ) : (
                        <button
                          className="bg-[#003d39] text-white px-4 py-2 rounded-lg hover:bg-[#74EE66] hover:text-black transition"
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

    // Default Dashboard
    return (
      <div className="p-6">
        <h1 className="text-3xl text-white mb-5">Welcome Student 👋</h1>
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

  return (
    <main className="w-screen font-system-ui min-h-screen bg-[#003d39]">
      <MdOutlineMenu
        className="lg:hidden cursor-pointer"
        onClick={() => setSidebarOpen(true)}
      />

      <section className="w-screen text-white flex gap-5">
        {/* Sidebar */}
        <section
          className={`w-[20%] lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-[140%]"
            } flex items-center flex-col gap-4 bg-[#055e58] pt-6 shadow-lg ml-4`}
        >
          <button
            className="text-xl cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            X
          </button>

          <section className="h-40 flex items-center flex-col">
            <img
              src="https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Clipart.png"
              className="w-1/3 pb-2"
              alt="admin pic"
            />
            <p className="font-bold text-lg">Student</p>
          </section>

          <section>
            {navItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 p-3 cursor-pointer hover:bg-[#003d39] rounded-xl"
                onClick={() => setActiveSection(item.name)}
              >
                <div className="text-xl">{item.icon}</div>
                <div className="text-xl">{item.name}</div>
              </div>
            ))}
          </section>

          <button
            type="button"
            onClick={handleLogout}
            className="w-25 mb-6 h-10 bg-[#003d39] text-white text-lg font-bold rounded-2xl hover:bg-[#74EE66] hover:text-black transition"
          >
            Logout
          </button>
        </section>

        {/* Content */}
        <section className="w-[90%] h-[100%]">
          <section className="w-[95%] overflow-y-auto h-screen bg-[#055e58] shadow-lg mx-6">
            {renderSectionData()}
          </section>
        </section>
      </section>
    </main>
  );
};

export default StudentDashboard;
