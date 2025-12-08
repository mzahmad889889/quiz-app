import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import axios from "axios";

const QuizHistory = () => {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/quiz-history/${user.id}`
        );
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [user]);

  if (!user) return <p className="text-red-500">User not found!</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Quiz History</h2>
      {history.length === 0 ? (
        <p className="text-white text-center">No quiz attempts yet.</p>
      ) : (
        <table className="w-[95%] m-auto text-white border text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Quiz</th>
              <th>Date</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, idx) => (
              <tr key={h._id}>
                <td>{idx + 1}</td>
                <td>Quiz {idx + 1}</td>
                <td>{new Date(h.submittedAt).toLocaleString()}</td>
                <td>{h.score}/{h.totalQuestions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuizHistory;
