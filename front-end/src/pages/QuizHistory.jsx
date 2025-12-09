import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";

const QuizHistory = () => {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz-history/${user.id}`);
        setHistory(res.data);
      } catch (err) {
        console.error(err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (!user) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-bold text-red-500">User Not Found</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-bold">Loading Quiz History...</h1>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-bold">No Quiz History Found</h1>
      </div>
    );
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Quiz History</h1>
      <table className="w-[95%] m-auto shadow-xl/30">
        <thead>
          <tr className="bg-[#003d39]">
            <th className="px-4 py-2">Quiz</th>
            <th className="px-4 py-2">Submitted Time</th>
            <th className="px-4 py-2">Result</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {history.map((quiz, idx) => {
            // Format date
            const submittedAt = new Date(quiz.submittedAt).toLocaleString();
            const result = `${quiz.score}/${quiz.totalQuestions}`;

            return (
              <tr key={idx} className="bg-[#055e58]">
                <td className="px-4 py-2">{quiz.quizName || `Quiz ${idx + 1}`}</td>
                <td className="px-4 py-2">{submittedAt}</td>
                <td className="px-4 py-2">{result}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default QuizHistory;
