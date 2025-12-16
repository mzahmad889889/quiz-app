import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentResult from "./StudnentResult"; // ✅ RESULT COMPONENT

const StudentQuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/student-quiz-history"
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching quiz history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // 🔥 GROUP HISTORY BY STUDENT
  const groupedStudents = history.reduce((acc, item) => {
    const studentId = item.student?._id || item.student?.id;
    if (!studentId) return acc;

    if (!acc[studentId]) {
      acc[studentId] = {
        id: studentId,
        name: item.student?.name || "Unknown Student",
        rollno: item.student?.rollno || "—",
        attempts: 0,
        quizzes: [],
      };
    }

    acc[studentId].attempts += 1;
    acc[studentId].quizzes.push(item);

    return acc;
  }, {});

  const studentsArray = Object.values(groupedStudents);

  if (loading) {
    return (
      <p className="text-white text-center mt-4">
        Loading quiz history...
      </p>
    );
  }

  return (
    <div className="p-6 rounded-xl">

      {/* 🔁 CONDITIONAL RENDER */}
      {selectedStudent ? (
        <StudentResult
          student={selectedStudent}
          onBack={() => setSelectedStudent(null)}
        />
      ) : (
        <>
          <h2 className="text-2xl font-bold text-white mb-4">
            Students Quiz History
          </h2>

          <div className="overflow-x-auto">
            <table className="shadow-xl/30 w-[95%] m-auto text-center">
              <thead className="text-white bg-[#003d39]">
                <tr>
                  <th className="p-3">S.No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Attempted Quizzes</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {studentsArray.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-white">
                      No quiz history found.
                    </td>
                  </tr>
                ) : (
                  studentsArray.map((student, idx) => (
                    <tr key={student.id} className="text-white border-b">
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">{student.rollno}</td>
                      <td className="p-3 font-semibold">
                        {student.attempts}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="bg-[#003d39] px-3 py-1 rounded-lg hover:bg-[#74EE66] hover:text-black transition"
                        >
                          Results
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentQuizHistory;
