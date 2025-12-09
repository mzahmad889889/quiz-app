import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentQuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student-quiz-history");
        setHistory(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz history", err);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p className="text-white text-center mt-4">Loading quiz history...</p>;
  }

  return (
    <div className="p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-4">Students Quiz History</h2>

      <div className="overflow-x-auto">
        <table className="shadow-xl/30 w-[95%] m-auto text-center overflow-hidden">
          <thead className="text-white bg-[#003d39]">
            <tr>
              <th className="p-3">Student Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Score</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-wh">
                  No quiz history found.
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item._id}>
                  <td className="p-3">
                    {/* {item.studentId ? `${item.studentId.fname} ${item.studentId.lname}` : "Unknown Student"} */}
                    {item.student?.name || "Unknown Student"}
                  </td>
                  <td className="p-3">
                    {/* {item.studentId?.email} */}
                    {item.student?.email || "—"}
                  </td>
                  <td className="p-3 font-semibold">
                    {item.score}/{item.totalQuestions}
                  </td>
                  <td className="p-3">{new Date(item.submittedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentQuizHistory;
