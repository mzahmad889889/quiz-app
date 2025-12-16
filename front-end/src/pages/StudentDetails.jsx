import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDetails = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students");
        setStudentData(res.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching student data");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <p className="text-white p-4">Loading students...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Students</h2>

      <table className="w-[95%] m-auto shadow-xl/30 text-center">
        <thead className="bg-[#003d39] h-10 text-white">
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Roll No</th>
            <th>Assigned Quiz</th>
            <th>Submitted Quiz</th>
            <th>Pending Quiz</th>
          </tr>
        </thead>

        <tbody className="h-30">
          {studentData.map((s, idx) => (
            <tr key={s._id}>
              <td>{idx + 1}</td>
              <td>{s.fname} {s.lname}</td>
              <td className="p-3">
                    {/* {item.studentId?.email} */}
                    {s.email || "—"}
                  </td>
              <td>{s.rollno}</td>

              {/* Coming from Backend */}
              <td>{s.assignedQuizzesCount}</td>
              <td>{s.submittedQuizzesCount}</td>
              <td>{s.pendingQuizzesCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDetails;
