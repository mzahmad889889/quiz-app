import React, { useState, useEffect } from "react";
import axios from "axios";

const Quiz = ({ questions, quizId }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 min per question
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));

  // Timer
  useEffect(() => {
    if (timeLeft === 0) { handleNextQuestion(); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (index) => {
    const updated = [...selectedAnswers];
    updated[currentQIndex] = index;
    setSelectedAnswers(updated);
    setSelectedOption(index);
  };

  const handleSubmitQuiz = async () => {
    try {
      const score = questions.reduce((acc, q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswer) return acc + 1;
        return acc;
      }, 0);

      await axios.post("http://localhost:5000/api/submit-quiz", {
        studentId: user.id,
        quizId,
        answers: selectedAnswers.map((opt, idx) => ({
          questionId: questions[idx]._id,
          selectedOption: opt,
        })),
        score,
        totalQuestions: questions.length,
      });

      alert(`Quiz submitted! Score: ${score}/${questions.length}`);
      window.location.reload(); // redirect back to dashboard
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting quiz");
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentQIndex + 1 < questions.length) setCurrentQIndex(currentQIndex + 1);
    else handleSubmitQuiz();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex bg-[#055e58] rounded-xl shadow-lg p-6 w-full">
      {/* Left side - Question */}
      <div className="w-3/4 pr-6">
        <h2 className="text-xl font-bold mb-4 text-white">{questions[currentQIndex].question}</h2>
        <div className="grid grid-cols-1 gap-3">
          {questions[currentQIndex].options.map((opt, idx) => (
            <button
              key={idx}
              className={`text-left px-4 py-2 border rounded-lg w-full ${
                selectedOption === idx
                  ? "bg-green-500 border-green-500"
                  : "bg-[#055e58] border-gray-300 text-white"
              }`}
              onClick={() => handleOptionSelect(idx)}
            >
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextQuestion}
          className="mt-4 px-4 py-2 bg-[#003d39] rounded hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in cursor-pointer"
        >
          Submit Answer
        </button>
      </div>

      {/* Right side - Timer and Question List */}
      <div className="w-1/4 pl-4 flex flex-col">
        <div className="mb-4 p-4 bg-[#003d39] rounded-lg text-center text-white">
          <p className="text-sm mb-1">Timer Remaining</p>
          <p className="text-2xl font-bold">
            {minutes.toString().padStart(2,"0")}:{seconds.toString().padStart(2,"0")}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <h4 className="font-semibold mb-2 text-white text-2xl">Quiz Questions List</h4>
          <div className="flex flex-col gap-2 border-1 p-2">
            {questions.map((q, idx) => (
              <button
                key={idx}
                className={`text-left px-2 py-1 border rounded ${
                  idx === currentQIndex
                    ? "bg-green-500 border-green-700 text-white"
                    : "bg-[#055e58] border-gray-300 text-white"
                }`}
                onClick={() => setCurrentQIndex(idx)}
              >
                Question {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
