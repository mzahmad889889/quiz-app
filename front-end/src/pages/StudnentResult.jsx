const StudentResult = ({ student, onBack }) => {
  return (
    <div className="p-2 text-white">
      <h2 className="text-2xl font-bold mb-4">
        Result Summary
      </h2>

      <table className="w-full text-center shadow-xl/30">
        <thead className="bg-[#003d39]">
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th className="p-2">Quiz Title</th>
            <th className="p-2">Total Marks</th>
            <th className="p-2">Obtained Marks</th>
            <th className="p-2">Submit Date</th>
          </tr>
        </thead>
        <tbody>
          {student.quizzes.map((q, i) => (
            <tr key={i}>
                <td>{student.name}</td>
                <td>{student.rollno}</td>
              <td className="p-2">{q.quiz?.title || "—"}</td>
              <td className="p-2">{q.totalQuestions}</td>
              <td className="p-2">{q.score}</td>
              <td className="p-2">
                {new Date(q.submittedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={onBack}
        className=" mt-6 bg-[#003d39] px-4 py-1 rounded-lg hover:bg-[#74EE66] hover:text-black"
      >
        ← Back
      </button>
    </div>
  );
};

export default StudentResult;
