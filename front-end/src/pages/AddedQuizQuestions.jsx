import React, { useEffect, useState } from "react";
import axios from "axios";

const AddedQuizQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editData, setEditData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });
  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/questions");
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, []);

  // Open edit popup
  const openEditPopup = (q) => {
    setEditingQuestion(q._id);
    setEditData({
      question: q.question,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
    });
  };

  // Save edited question
  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/questions/${editingQuestion}`, editData);
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === editingQuestion ? { ...q, ...editData } : q
        )
      );
      setEditingQuestion(null); // Close popup
    } catch (err) {
      console.error("Error updating question:", err);
    }
  };

  // Delete question
  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };
  if (questions.length === 0) {
    return <p className="p-4 text-white">No questions added yet.</p>;
  }
  return (
    <div className="p-4 text-white relative">
      <h2 className="text-2xl font-bold mb-4">Added Questions</h2>
      <div>
        <table className="min-w-full rounded-lg">
          <thead className="bg-[#003d39] text-white">
            <tr>
              <th>S.No</th>
              <th className="py-2 px-4 text-left">Question</th>
              <th className="py-2 px-4 text-left">Options</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q,idx) => (
              <tr key={q._id} className="border-b border-gray-700">
                <td>{idx + 1}</td>
                <td className="py-2 px-4">{q.question}</td>
                <td className="py-2 px-4 flex gap-2 flex-wrap">
                  {q.options.map((opt, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded ${
                        i === q.correctAnswer
                          ? "bg-green-400 text-black font-bold"
                          : "text-white border border-gray-500"
                      }`}
                    >
                      {opt}
                    </span>
                  ))}
                </td>
                <td className="py-2 px-4 ">
                  <div className="flex justify-center items-center gap-3">
                    <button
                    onClick={() => openEditPopup(q)}
                    className="bg-blue-500 cursor-pointer hover:bg-blue-600 px-2 py-1 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteQuestion(q._id)}
                    className="bg-red-500 cursor-pointer hover:bg-red-600 px-2 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>              
            </tr>
          </tbody>
        </table>
      </div>
      {/* EDIT POPUP */}
      {editingQuestion && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-[#003d39] p-6 rounded-xl w-96 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Question</h2>
            {/* EDIT QUESTION INPUT */}
            <input
              type="text"
              className="w-full p-2 mb-4 text-white rounded"
              value={editData.question}
              onChange={(e) =>
                setEditData({ ...editData, question: e.target.value })
              }
            />
            {/* EDIT OPTIONS */}
            {editData.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                className="w-full p-2 mb-2 text-white rounded"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...editData.options];
                  newOptions[i] = e.target.value;
                  setEditData({ ...editData, options: newOptions });
                }}
              />
            ))}
            {/* CORRECT ANSWER SELECT */}
            <label className="block mt-2 mb-1">Correct Answer (0–3):</label>
            <input
              type="number"
              min="0"
              max="3"
              className="w-full p-2 mb-4 text-white rounded"
              value={editData.correctAnswer}
              onChange={(e) =>
                setEditData({ ...editData, correctAnswer: Number(e.target.value) })
              }
            />
            <div className="flex justify-between">
              <button
                onClick={() => setEditingQuestion(null)}
                className="bg-gray-500 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-green-500 px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddedQuizQuestions;
