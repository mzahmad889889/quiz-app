import React, { useState } from "react";
import axios from "axios";

const Questions = ({ addedQuestions, setAddedQuestions }) => {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [csvFile, setCsvFile] = useState(null);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim()) return;
    if (options.some(opt => !opt.trim())) {
      alert("All options must be filled!");
      return;
    }
    if (correctIndex === null) {
      alert("Please select the correct answer!");
      return;
    }
    const newQuestion = {
      question: questionText,
      options,
      correctAnswer: correctIndex,
    };
    try {
      const res = await axios.post("http://localhost:5000/api/questions", newQuestion);
      setAddedQuestions(prev => [...prev, res.data]);
      console.log("Question saved to DB");
    } catch (err) {
      console.error("Error saving question:", err);
    }

    // Clear input fields
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(null);
  };

  const uploadCsv = async () => {
  if (!csvFile) return alert("Please select a CSV file");

  const formData = new FormData();
  formData.append("file", csvFile);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/upload-questions",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert(res.data.message || "Questions uploaded successfully");

    setCsvFile(null);

  } catch (err) {
    console.error("CSV upload error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Error uploading CSV");
  }
};

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-2">Add Question</h2>

      {/* CSV Upload Section */}
      <div className="mb-4 flex gap-2 items-center">
        <input type="file" accept=".csv" className="bg-[#003d39] rounded cursor-pointer text-white py-1.5 px-3" onChange={(e) => setCsvFile(e.target.files[0])} />
        <button
          onClick={uploadCsv}
          className="bg-[#003d39] font-bold hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in cursor-pointer text-white py-1.5 rounded px-3"
        >
          Upload CSV
        </button>
      </div>

      {/* Manual Question Form */}
      <textarea
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Enter question"
        className="p-2 rounded text-white text-lg w-full mb-3"
      />
      {options.map((opt, idx) => (
        <div key={idx} className="mb-1 flex items-center gap-2">
          <input
            type="radio"
            name="correctAnswer"
            checked={correctIndex === idx}
            onChange={() => setCorrectIndex(idx)}
            className="accent-green-500"
          />
          <input
            type="text"
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
            className="p-2 rounded text-white w-50"
          />
        </div>
      ))}
      <button
        onClick={handleAddQuestion}
        className="bg-[#003d39] font-bold hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in cursor-pointer text-white py-2 px-4 rounded-xl mt-3"
      >
        Add Question
      </button>
    </div>
  );
};

export default Questions;
