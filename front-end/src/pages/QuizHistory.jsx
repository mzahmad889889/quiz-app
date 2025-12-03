import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizHistory = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz-history/${user.id}`);
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [user.id]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Quiz History</h2>
      <table className="w-[95%] m-auto text-white border-1 text-center">
        <thead className="bg-[#003d39] border-1 h-12 text-white">
          <tr className="">
            <th className="p-2">#</th>
            <th className="p-2">Quiz</th>
            <th className="p-2">Date</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody className="border-1">
          {history.map((h, idx) => (
            <tr key={h._id} className="">
              <td className="p-2">{idx + 1}</td>
              <td className="p-2">Quiz {idx + 1}</td>
              <td className="p-2">{new Date(h.submittedAt).toLocaleString()}</td>
              <td className="p-2">{h.score}/{h.totalQuestions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizHistory;
