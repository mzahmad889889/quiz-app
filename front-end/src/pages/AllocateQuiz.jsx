import React, { useEffect, useState } from "react";
import axios from "axios";

const AllocateQuizes = ({ refreshSummary }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [questionCount, setQuestionCount] = useState(10);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students");
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleAllocate = (student) => {
    setSelectedStudent(student);
    setShowPopup(true);
  };

  const submitAllocation = async () => {
    if (!selectedStudent) return alert("Select student first");
    try {
      const res = await axios.post("http://localhost:5000/api/allocate", {
        studentId: selectedStudent._id,
        questionCount: Number(questionCount),
      });

      if (refreshSummary) refreshSummary();
      alert(`Quiz allocated successfully to ${selectedStudent.fname} ${selectedStudent.lname}`);
      setShowPopup(false);
      setSelectedStudent(null);
      setQuestionCount(10);
    } catch (err) {
      console.error("Allocation error:", err);
      alert("Error allocating quiz");
    }
  };

  if (loading) return <p className="text-white p-4">Loading students...</p>;
  return (
    <div className="p-4 text-white relative">
      <h2 className="text-2xl font-bold mb-4">Assign Quizzes</h2>
      <table className="w-[95%] m-auto shadow-xl/30 h-50  text-center">
        <thead className="bg-[#003d39] text-white">
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Roll No</th>
            <th>Assign Quizes</th>
          </tr>
        </thead>
        <tbody className="">
          {students.map((student, idx) => (
            <tr key={student._id}>
              <td>{idx + 1}</td>
              <td>{student.fname} {student.lname}</td>
              <td>{student.rollno}</td>
              <td>
                <button
                  className="bg-[#003d39] px-3 py-1 rounded hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in cursor-pointer"
                  onClick={() => handleAllocate(student)}
                >
                  Assign Quiz
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && selectedStudent && (
        <div className="fixed inset-0 bg-[#00000066] flex items-center justify-center z-50">
          <div className="bg-white text-black border-2 p-6 rounded-lg w-96">
            <h1 className="text-2xl text-center font-bold mb-3">Assign Quiz to</h1>
            <h3 className="text-lg">Name: {selectedStudent.fname} {selectedStudent.lname}</h3>
            <h3 className="text-lg mb-4">Rollno: {selectedStudent.rollno}</h3>
            <input type="text" />

            <div className="flex flex-col gap-3">
              <label>Select No of Questions</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="p-2 border"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
              </select>

              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  className="px-6 py-2 bg-gray-200 rounded hover:bg-red-500 hover:text-white"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-white bg-[#003d39] rounded hover:bg-[#74EE66] hover:text-black"
                  onClick={submitAllocation}
                >
                  Assign Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocateQuizes;
