import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";

const Quiz = ({ questions, quizId }) => {
  const { user } = useContext(UserContext);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 min per question

  if (!user) return <p>User not found!</p>;

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleNextQuestion();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (idx) => {
    const updated = [...selectedAnswers];
    updated[currentQIndex] = idx;
    setSelectedAnswers(updated);
    setSelectedOption(idx);

    if (skippedQuestions.includes(currentQIndex)) {
      setSkippedQuestions(skippedQuestions.filter(i => i !== currentQIndex));
    }
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
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz");
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    setSelectedOption(null);
    if (currentQIndex > 0) setCurrentQIndex(currentQIndex - 1);
  };

  const handleSkipQuestion = () => {
    if (!skippedQuestions.includes(currentQIndex)) {
      setSkippedQuestions([...skippedQuestions, currentQIndex]);
    }
    handleNextQuestion();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex bg-[#055e58] rounded-xl p-6">

      {/* Left - Questions */}
      <div className="flex w-[15%] flex-col gap-2 p-2 shadow-xl/30">
        <h2 className="text-white text-center font-bold text-lg">
          Total Questions {currentQIndex + 1}/{questions.length}
        </h2>

        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQIndex(idx)}
            className={`text-left px-2 py-1 border ${
              idx === currentQIndex ? "text-green-400 font-bold text-xl" : "bg-[#055e58] text-white"
            }`}
          >
            Question {idx + 1}
          </button>
        ))}
      </div>

      {/* Center - Question */}
      <div className="w-3/4 mx-4 p-4 shadow-xl/30">
        <h2 className="text-xl font-bold mb-4 text-white">
          {currentQIndex + 1}. {questions[currentQIndex].question}
        </h2>

        <div className="grid gap-4">
          {questions[currentQIndex].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className={`text-left px-4 py-2 border rounded-lg w-full ${
                selectedOption === idx ? "bg-green-500" : "bg-[#055e58] text-white"
              }`}
            >
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex mt-7 justify-between">
          <div className="flex gap-2">

            <button
              className="px-3 cursor-pointer bg-[#003d39] text-white text-lg rounded-xl hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in"
              onClick={handlePreviousQuestion}
              disabled={currentQIndex === 0}
            >
              Previous
            </button>

            {currentQIndex + 1 < questions.length && (
              <button
                className="px-4 cursor-pointer bg-[#003d39] text-white text-lg rounded-xl hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            )}

            <button
              className="w-20 h-10 cursor-pointer bg-[#003d39] text-white text-lg rounded-xl hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in"
              onClick={handleSkipQuestion}
            >
              Skip
            </button>
          </div>

          {/* SUBMIT BUTTON (UPDATED LOGIC ONLY) */}
          <div>
            <button
              onClick={handleSubmitQuiz}
              disabled={currentQIndex !== questions.length - 1}
              className={`px-4 h-10 cursor-pointer text-white text-lg rounded-xl transition duration-200 ease-in
                ${
                  currentQIndex !== questions.length - 1
                    ? "bg-[#003d39] cursor-not-allowed"
                    : "bg-[#003d39] hover:bg-green-400 hover:text-black"
                }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Right - Skipped + Timer */}
      <div className="w-[18%] pl-4 pt-4 flex flex-col text-center shadow-xl/30">
        <div className="w-[80%] mx-auto mb-4 p-2 bg-[#003d39] rounded-lg text-center text-white">
          <p className="text-sm mb-1">Timer Remaining</p>
          <p className="text-2xl font-bold">
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </p>
        </div>

        <h4 className="text-white text-xl mb-5">Skipped Questions</h4>
        <div className="w-[80%] flex mx-auto flex-col gap-3">
          {skippedQuestions.length === 0 ? (
            <p className="text-white">No skipped questions</p>
          ) : (
            skippedQuestions.map((idx) => (
              <button
                className="border-1 rounded p-1"
                key={idx}
                onClick={() => setCurrentQIndex(idx)}
              >
                Question {idx + 1}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
