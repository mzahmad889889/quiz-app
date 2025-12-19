// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import multer from "multer";
// import csv from "csv-parser";
// import fs from "fs";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quizDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ DB Error:", err));

// // -------------------- MODELS --------------------

// // USERS (Students & Admin)
// const userSchema = new mongoose.Schema({
//   fname: String,
//   lname: String,
//   email: { type: String, unique: true },
//   password: String,
//   rollno: Number,
//   role: { type: String, default: "student" } // "student" or "admin"
// });
// const User = mongoose.model("User", userSchema);

// const questionSchema = new mongoose.Schema({
//   question: String,
//   options: [String],
//   correctAnswer: Number,
//   createdAt: { type: Date, default: Date.now },
//   category: {
//     type: String,
//     required: true
//   }
// });
// const Question = mongoose.model("Question", questionSchema);

// const allocatedQuizSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   category: {
//     type: String,
//     required: true
//   },
//   questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
//   allocatedAt: { type: Date, default: Date.now },
// });

// const AllocatedQuiz = mongoose.model("AllocatedQuiz", allocatedQuizSchema);

// // QUIZ RESULTS
// const quizResultSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   quizId: { type: mongoose.Schema.Types.ObjectId, ref: "AllocatedQuiz" },
//   answers: [
//     {
//       questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
//       selectedOption: Number,
//     },
//   ],
//   score: Number,
//   totalQuestions: Number,
//   submittedAt: { type: Date, default: Date.now },
// });
// const QuizResult = mongoose.model("QuizResult", quizResultSchema);

// // ------------------ FILE UPLOAD CONFIG ------------------
// const upload = multer({ dest: "uploads/" });

// // ------------------ ROUTES ------------------

// app.post("/api/upload-questions", upload.single("file"), async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "CSV file required" });

//   const results = [];
//   fs.createReadStream(req.file.path)
//     .pipe(csv()) // comma-separated CSV
//     .on("data", (row) => results.push(row))
//     .on("end", async () => {
//       try {
//         const questionsToInsert = [];

//         for (const row of results) {
//           const { question, option1, option2, option3, option4, correctAnswer, category } = row;

//           if (!category || !question || !option1 || !option2 || !option3 || !option4 || correctAnswer === undefined) continue;

//           const options = [option1, option2, option3, option4].map(o => o.trim());
//           const correctIndex = Number(correctAnswer);

//           if (isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
//             console.warn("Invalid correct answer index:", question, "CorrectAnswer:", correctAnswer);
//             continue;
//           }

//           questionsToInsert.push({
//             question: question.trim(),
//             options,
//             correctAnswer: correctIndex,
//             category: category.trim().toLowerCase(),
//           });
//         }

//         if (questionsToInsert.length === 0) {
//           return res.status(400).json({ message: "No valid questions found" });
//         }

//         const inserted = await Question.insertMany(questionsToInsert);
//         fs.unlinkSync(req.file.path);

//         res.json({
//           message: "Questions uploaded successfully",
//           totalInserted: inserted.length
//         });
//       } catch (err) {
//         console.error("CSV upload error:", err);
//         res.status(500).json({ message: "Error uploading CSV", error: err.message });
//       }
//     });
// });



// // ------------------ EXISTING ROUTES ------------------

// // ADMIN dashboard summary route (exclude admins from student counts)
// app.get("/api/admin-dashboard-summary", async (req, res) => {
//   try {
//     const totalStudents = await User.countDocuments({ role: "student" });
//     const totalAdmins = await User.countDocuments({ role: "admin" });
//     const totalAssignedQuizzes = await AllocatedQuiz.countDocuments();
//     const totalSubmittedQuizzes = await QuizResult.countDocuments();
//     const totalPendingQuizzes = Math.max(totalAssignedQuizzes - totalSubmittedQuizzes, 0);

//     res.json({
//       totalStudents,
//       totalAdmins,
//       totalAssignedQuizzes,
//       totalSubmittedQuizzes,
//       totalPendingQuizzes,
//     });
//   } catch (err) {
//     console.error("Error fetching admin dashboard summary:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // QUESTION CRUD
// app.post("/api/questions", async (req, res) => {
//   try {
//     const { question, options, correctAnswer } = req.body;
//     if (!question || !Array.isArray(options) || options.length < 2 || correctAnswer == null) {
//       return res.status(400).json({ message: "Invalid question payload" });
//     }
//     const newQ = new Question({ question, options, correctAnswer });
//     await newQ.save();
//     res.status(201).json(newQ);
//   } catch (err) {
//     console.error("Add question error:", err);
//     res.status(500).json({ message: "Error adding question", error: err });
//   }
// });

// app.get("/api/questions", async (req, res) => {
//   try {
//     const q = await Question.find();
//     res.json(q);
//   } catch (err) {
//     console.error("Get questions error:", err);
//     res.status(500).json({ message: "Error", error: err });
//   }
// });

// app.put("/api/questions/:id", async (req, res) => {
//   try {
//     const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ message: "Question not found" });
//     res.json(updated);
//   } catch (err) {
//     console.error("Update question error:", err);
//     res.status(500).json({ message: "Error", error: err });
//   }
// });

// app.delete("/api/questions/:id", async (req, res) => {
//   try {
//     await Question.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted" });
//   } catch (err) {
//     console.error("Delete question error:", err);
//     res.status(500).json({ message: "Error", error: err });
//   }
// });

// // USER (STUDENT) AUTH / REGISTER
// app.post("/api/register", async (req, res) => {
//   try {
//     const { fname, lname, email, password } = req.body;
//     if (!fname || !lname || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const last = await User.findOne({ role: "student" }).sort({ rollno: -1 });
//     const newRoll = last ? last.rollno + 1 : 1001;

//     const user = new User({
//       fname,
//       lname,
//       email,
//       password,
//       rollno: newRoll,
//       role: "student"
//     });

//     await user.save();

//     res.json({
//       message: "Student Registered",
//       rollno: newRoll,
//       userId: user._id
//     });

//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ message: "Error", error: err });
//   }
// });

// // ... REST OF YOUR EXISTING ROUTES ...

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password, role } = req.body;
//     if (!email || !password || !role) return res.status(400).json({ message: "Email and password required" });

//     const user = await User.findOne({ email, password, role });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     res.json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         fname: user.fname,
//         lname: user.lname,
//         rollno: user.rollno,
//         email: user.email,
//         role: user.role
//       },
//     });
//   } catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ message: "Server error during login" });
//   }
// });

// // ALLOCATE QUIZ

// app.post("/api/allocate", async (req, res) => {
//   try {
//     const { studentId, questionCount, category } = req.body;

//     if (!studentId) {
//       return res.status(400).json({ message: "studentId is required" });
//     }

//     if (!category) {
//       return res.status(400).json({ message: "category is required" });
//     }

//     // count questions of selected category
//     const total = await Question.countDocuments({ category });

//     if (total === 0) {
//       return res.status(400).json({
//         message: `No questions found for category: ${category}`
//       });
//     }

//     const size = Math.min(Number(questionCount) || 10, total);

//     // random questions from selected category
//     const questions = await Question.aggregate([
//       { $match: { category } },
//       { $sample: { size } }
//     ]);

//     const ids = questions.map(q => q._id);

//     const alloc = await new AllocatedQuiz({
//       studentId,
//       category,          // 🔥 save category with allocation
//       questions: ids
//     }).save();

//     const populated = await AllocatedQuiz.findById(alloc._id)
//       .populate("studentId", "fname lname email rollno")
//       .populate("questions", "question options correctAnswer category");

//     res.json({
//       message: "Quiz allocated successfully",
//       allocation: populated
//     });

//   } catch (err) {
//     console.error("Allocate error:", err);
//     res.status(500).json({ message: "Error allocating quiz", error: err.message });
//   }
// });


// // STUDENT ASSIGNED QUIZZES - NEW
// // returns allocations with populated questions and a submitted flag
// app.get("/api/student-assigned/:studentId", async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     if (!studentId) return res.status(400).json({ message: "studentId required" });

//     const allocs = await AllocatedQuiz.find({ studentId }).sort({ allocatedAt: -1 }).populate("questions");

//     // fetch submitted quizIds for this student
//     const submitted = await QuizResult.find({ studentId }).select("quizId");
//     const submittedIds = new Set(submitted.map(s => s.quizId.toString()));

//     const result = allocs.map(a => {
//       const totalQuestions = Array.isArray(a.questions) ? a.questions.length : 0;
//       return {
//         _id: a._id,
//         quizId: {
//           _id: a._id,
//           title: `Quiz (${totalQuestions} Qs)`,
//           totalQuestions,
//         },
//         questions: a.questions, // populated questions
//         assignedAt: a.allocatedAt,
//         submitted: submittedIds.has(a._id.toString()),
//       };
//     });

//     res.json(result);
//   } catch (err) {
//     console.error("student-assigned error:", err);
//     res.status(500).json({ message: "Error", error: err });
//   }
// });

// // GET quiz questions by allocation id (quizId = allocation _id)
// app.get("/api/quiz-questions/:quizId", async (req, res) => {
//   try {
//     const { quizId } = req.params;
//     if (!quizId) return res.status(400).json({ message: "quizId required" });

//     const alloc = await AllocatedQuiz.findById(quizId).populate("questions");
//     if (!alloc) return res.status(404).json({ message: "Allocation not found" });

//     res.json(alloc.questions || []);
//   } catch (err) {
//     console.error("quiz-questions error:", err);
//     res.status(500).json({ message: "Error", error: err });
//   }
// });

// // GET unsubmitted allocations
// app.get("/api/student-quiz/:studentId", async (req, res) => {
//   try {
//     const submitted = await QuizResult.find({ studentId: req.params.studentId }).select("quizId");
//     const submittedIds = submitted.map((s) => s.quizId.toString());

//     const alloc = await AllocatedQuiz.find({
//       studentId: req.params.studentId,
//       _id: { $nin: submittedIds }
//     })
//       .sort({ allocatedAt: -1 })
//       .populate("questions");

//     res.json(alloc);
//   } catch (err) {
//     console.error("student-quiz error:", err);
//     res.status(500).json({ message: "Error", error: err });
//   }
// });

// // SUBMIT QUIZ
// app.post("/api/submit-quiz", async (req, res) => {
//   try {
//     const { studentId, quizId, answers, score, totalQuestions } = req.body;
//     if (!studentId || !quizId) return res.status(400).json({ message: "studentId and quizId required" });

//     // prevent duplicate
//     const already = await QuizResult.findOne({ studentId, quizId });
//     if (already) {
//       return res.status(400).json({ message: "Quiz already submitted" });
//     }

//     const result = new QuizResult({ studentId, quizId, answers, score, totalQuestions });
//     await result.save();

//     res.json({ message: "Quiz submitted successfully", result });
//   } catch (err) {
//     console.error("submit-quiz error:", err);
//     res.status(500).json({ message: "Error submitting quiz", error: err });
//   }
// });

// // ADMIN: Get all quiz results (shaped)
// app.get("/api/student-quiz-history", async (req, res) => {
//   try {
//     const historyRaw = await QuizResult.find().sort({ submittedAt: -1 }).populate("studentId").populate({
//       path: "quizId",
//       populate: { path: "questions", select: "question options correctAnswer" }
//     });

//     const shaped = historyRaw.map(h => {
//       const student = h.studentId || {};
//       const allocation = h.quizId || {};
//       const questions = Array.isArray(allocation.questions) ? allocation.questions : [];
//       return {
//         _id: h._id,
//         student: {
//           _id: student._id,
//           name: `${student.fname || ""} ${student.lname || ""}`.trim() || "Unknown Student",
//           email: student.email || "", rollno: student.rollno || ""
//         },
//         quiz: {
//           _id: allocation._id,
//           title: allocation.title || `Quiz (${questions.length} Qs)`,
//           totalQuestions: questions.length,
//         },
//         score: h.score ?? 0,
//         totalQuestions: h.totalQuestions ?? (questions.length || 0),
//         submittedAt: h.submittedAt,
//         answers: h.answers || []
//       };
//     });

//     res.json(shaped);
//   } catch (err) {
//     console.error("student-quiz-history error:", err);
//     res.status(500).json({ message: "Server error while fetching quiz history", error: err });
//   }
// });

// // STUDENT: quiz history
// app.get("/api/quiz-history/:studentId", async (req, res) => {
//   try {
//     const history = await QuizResult.find({ studentId: req.params.studentId })
//       .sort({ submittedAt: -1 })
//       .populate("studentId", "fname lname rollno email")
//       .populate({
//         path: "quizId",
//         populate: { path: "questions", select: "question options correctAnswer" },
//       });

//     // shape to be convenient for frontend
//     const shaped = history.map(h => {
//       const student = h.studentId || {};
//       const allocation = h.quizId || {};
//       const questions = Array.isArray(allocation.questions) ? allocation.questions : [];
//       return {
//         _id: h._id,
//         student: {
//           _id: student._id,
//           name: `${student.fname || ""} ${student.lname || ""}`.trim() || "Unknown Student",
//           email: student.email || ""
//         },
//         quiz: {
//           _id: allocation._id,
//           questions,
//         },
//         score: h.score,
//         totalQuestions: h.totalQuestions ?? (questions.length || 0),
//         submittedAt: h.submittedAt,
//         answers: h.answers
//       };
//     });

//     res.json(shaped);
//   } catch (err) {
//     console.error("quiz-history error:", err);
//     res.status(500).json({ message: "Error fetching history", error: err });
//   }
// });

// // STUDENTS LIST (only students, exclude admins)
// app.get("/api/students", async (req, res) => {
//   try {
//     // fetch only users with role: "student"
//     const students = await User.find({ role: "student" }, "fname lname rollno email");

//     const result = await Promise.all(
//       students.map(async (s) => {
//         const assigned = await AllocatedQuiz.find({ studentId: s._id }).populate("questions");
//         const submitted = await QuizResult.find({ studentId: s._id });

//         return {
//           _id: s._id,
//           fname: s.fname,
//           lname: s.lname,
//           rollno: s.rollno,
//           email: s.email,
//           assignedQuizzesCount: assigned.length,
//           submittedQuizzesCount: submitted.length,
//           pendingQuizzesCount: Math.max(assigned.length - submitted.length, 0),
//           assignedQuizzes: assigned,
//           submittedQuizzes: submitted
//         };
//       })
//     );

//     res.json(result);
//   } catch (err) {
//     console.error("students error:", err);
//     res.status(500).json({ message: "Error", error: err });
//   }
// });

// // START SERVER
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// -------------------- MONGODB --------------------
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quizDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// -------------------- MODELS --------------------
const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  rollno: Number,
  role: { type: String, default: "student" }
});
const User = mongoose.model("User", userSchema);

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  createdAt: { type: Date, default: Date.now },
  category: { type: String, required: true }
});
const Question = mongoose.model("Question", questionSchema);

const allocatedQuizSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  allocatedAt: { type: Date, default: Date.now },
});
const AllocatedQuiz = mongoose.model("AllocatedQuiz", allocatedQuizSchema);

const quizResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "AllocatedQuiz" },
  answers: [{ questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" }, selectedOption: Number }],
  score: Number,
  totalQuestions: Number,
  submittedAt: { type: Date, default: Date.now },
});
const QuizResult = mongoose.model("QuizResult", quizResultSchema);

// -------------------- FILE UPLOAD --------------------
const upload = multer({ dest: "uploads/" });

app.post("/api/upload-questions", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "CSV file required" });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => results.push(row))
    .on("end", async () => {
      try {
        const questionsToInsert = [];

        for (const row of results) {
          const { question, option1, option2, option3, option4, correctAnswer, category } = row;
          if (!question || !option1 || !option2 || !option3 || !option4 || !category || correctAnswer === undefined) continue;

          const options = [option1, option2, option3, option4].map(o => o.trim());
          const correctIndex = Number(correctAnswer);
          if (isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) continue;

          questionsToInsert.push({
            question: question.trim(),
            options,
            correctAnswer: correctIndex,
            category: category.trim().toLowerCase(),
          });
        }

        if (questionsToInsert.length === 0) return res.status(400).json({ message: "No valid questions found" });

        const inserted = await Question.insertMany(questionsToInsert);
        fs.unlinkSync(req.file.path);

        res.json({ message: "Questions uploaded successfully", totalInserted: inserted.length });
      } catch (err) {
        console.error("CSV upload error:", err);
        res.status(500).json({ message: "Error uploading CSV", error: err.message });
      }
    });
});


// QUESTION CRUD
app.post("/api/questions", async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    if (!question || !Array.isArray(options) || options.length < 2 || correctAnswer == null) {
      return res.status(400).json({ message: "Invalid question payload" });
    }
    const newQ = new Question({ question, options, correctAnswer });
    await newQ.save();
    res.status(201).json(newQ);
  } catch (err) {
    console.error("Add question error:", err);
    res.status(500).json({ message: "Error adding question", error: err });
  }
});

app.get("/api/questions", async (req, res) => {
  try {
    const q = await Question.find();
    res.json(q);
  } catch (err) {
    console.error("Get questions error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

app.put("/api/questions/:id", async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Question not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update question error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

app.delete("/api/questions/:id", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete question error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});


// // ADMIN dashboard summary route (exclude admins from student counts)
app.get("/api/admin-dashboard-summary", async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalAssignedQuizzes = await AllocatedQuiz.countDocuments();
    const totalSubmittedQuizzes = await QuizResult.countDocuments();
    const totalPendingQuizzes = Math.max(totalAssignedQuizzes - totalSubmittedQuizzes, 0);

    res.json({
      totalStudents,
      totalAdmins,
      totalAssignedQuizzes,
      totalSubmittedQuizzes,
      totalPendingQuizzes,
    });
  } catch (err) {
    console.error("Error fetching admin dashboard summary:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// -------------------- USER REGISTER & LOGIN --------------------
app.post("/api/register", async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;
    if (!fname || !lname || !email || !password) return res.status(400).json({ message: "All fields required" });

    const last = await User.findOne({ role: "student" }).sort({ rollno: -1 });
    const newRoll = last ? last.rollno + 1 : 1001;

    const user = new User({ fname, lname, email, password, rollno: newRoll, role: "student" });
    await user.save();

    res.json({ message: "Student Registered", rollno: newRoll, userId: user._id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: "Email, password & role required" });

    const user = await User.findOne({ email, password, role });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user: { id: user._id, fname: user.fname, lname: user.lname, rollno: user.rollno, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// -------------------- ALLOCATE QUIZ --------------------
app.post("/api/allocate", async (req, res) => {
  try {
    const { studentId, questionCount, category } = req.body;
    if (!studentId || !category) return res.status(400).json({ message: "studentId and category required" });

    // check student exists
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const total = await Question.countDocuments({ category });
    if (total === 0) return res.status(400).json({ message: `No questions found for category: ${category}` });

    const size = Math.min(Number(questionCount) || 10, total);
    const questions = await Question.aggregate([{ $match: { category } }, { $sample: { size } }]);
    const ids = questions.map(q => q._id);

    const alloc = await new AllocatedQuiz({ studentId, category, questions: ids }).save();
    const populated = await AllocatedQuiz.findById(alloc._id).populate("questions");

    res.json({ message: "Quiz allocated successfully", allocation: populated });
  } catch (err) {
    console.error("Allocate error:", err);
    res.status(500).json({ message: "Error allocating quiz", error: err.message });
  }
});

app.get("/api/student-assigned/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) return res.status(400).json({ message: "studentId required" });

    const allocs = await AllocatedQuiz.find({ studentId }).sort({ allocatedAt: -1 }).populate("questions");

    // fetch submitted quizIds for this student
    const submitted = await QuizResult.find({ studentId }).select("quizId");
    const submittedIds = new Set(submitted.map(s => s.quizId.toString()));

    const result = allocs.map(a => {
      const totalQuestions = Array.isArray(a.questions) ? a.questions.length : 0;
      return {
        _id: a._id,
        quizId: {
          _id: a._id,
          title: `Quiz (${totalQuestions} Qs)`,
          totalQuestions,
        },
        questions: a.questions, // populated questions
        assignedAt: a.allocatedAt,
        submitted: submittedIds.has(a._id.toString()),
      };
    });

    res.json(result);
  } catch (err) {
    console.error("student-assigned error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

// -------------------- STUDENT QUIZ --------------------
app.get("/api/student-quiz/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const submitted = await QuizResult.find({ studentId }).select("quizId");
    const submittedIds = submitted.map(s => s.quizId.toString());

    const alloc = await AllocatedQuiz.find({ studentId, _id: { $nin: submittedIds } }).populate("questions").sort({ allocatedAt: -1 });
    res.json(alloc);
  } catch (err) {
    console.error("student-quiz error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

// -------------------- SUBMIT QUIZ --------------------
app.post("/api/submit-quiz", async (req, res) => {
  try {
    const { studentId, quizId, answers, score, totalQuestions } = req.body;
    if (!studentId || !quizId) return res.status(400).json({ message: "studentId and quizId required" });

    const allocation = await AllocatedQuiz.findById(quizId);
    if (!allocation) return res.status(404).json({ message: "Quiz allocation not found" });
    if (allocation.studentId.toString() !== studentId) return res.status(403).json({ message: "This quiz is not assigned to this student" });

    const already = await QuizResult.findOne({ studentId, quizId });
    if (already) return res.status(400).json({ message: "Quiz already submitted" });

    const result = new QuizResult({ studentId, quizId, answers, score, totalQuestions });
    await result.save();
    res.json({ message: "Quiz submitted successfully", result });
  } catch (err) {
    console.error("submit-quiz error:", err);
    res.status(500).json({ message: "Error submitting quiz", error: err });
  }
});

// ADMIN: get all quiz results
app.get("/api/student-quiz-history", async (req, res) => {
  try {
    const history = await QuizResult.find()
      .populate("studentId", "fname lname rollno email")
      .populate("quizId");

    const shaped = history.map(h => ({
      _id: h._id,
      student: {
        _id: h.studentId._id,
        name: `${h.studentId.fname} ${h.studentId.lname}`,
        rollno: h.studentId.rollno,
        email: h.studentId.email,
      },
      quiz: {
        _id: h.quizId._id,
        totalQuestions: h.totalQuestions,
        questions: h.quizId.questions
      },
      score: h.score,
      totalQuestions: h.totalQuestions,
      submittedAt: h.submittedAt,
      answers: h.answers
    }));

    res.json(shaped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// -------------------- STUDENT QUIZ HISTORY --------------------
app.get("/api/quiz-history/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const history = await QuizResult.find({ studentId }).sort({ submittedAt: -1 }).populate("quizId").populate("studentId", "fname lname rollno email");

    const shaped = history.map(h => {
      const allocation = h.quizId || {};
      const questions = Array.isArray(allocation.questions) ? allocation.questions : [];

      return {
        _id: h._id,
        student: {
          _id: studentId,
          name: `${h.studentId.fname} ${h.studentId.lname}`.trim(),
          email: h.studentId.email
        },
        quiz: { _id: allocation._id, questions },
        score: h.score,
        totalQuestions: h.totalQuestions ?? (questions.length || 0),
        submittedAt: h.submittedAt,
        answers: h.answers
      };
    });

    res.json(shaped);
  } catch (err) {
    console.error("quiz-history error:", err);
    res.status(500).json({ message: "Error fetching history", error: err });
  }
});
// quiz questions
app.get("/api/quiz-questions/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    if (!quizId) return res.status(400).json({ message: "quizId required" });

    const alloc = await AllocatedQuiz.findById(quizId).populate("questions");
    if (!alloc) return res.status(404).json({ message: "Allocation not found" });

    res.json(alloc.questions || []);
  } catch (err) {
    console.error("quiz-questions error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

// GET unsubmitted allocations
app.get("/api/student-quiz/:studentId", async (req, res) => {
  try {
    const submitted = await QuizResult.find({ studentId: req.params.studentId }).select("quizId");
    const submittedIds = submitted.map((s) => s.quizId.toString());

    const alloc = await AllocatedQuiz.find({
      studentId: req.params.studentId,
      _id: { $nin: submittedIds }
    })
      .sort({ allocatedAt: -1 })
      .populate("questions");

    res.json(alloc);
  } catch (err) {
    console.error("student-quiz error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

// -------------------- STUDENTS LIST FOR ADMIN --------------------
app.get("/api/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }, "fname lname rollno email");
    const result = await Promise.all(
      students.map(async s => {
        const assigned = await AllocatedQuiz.find({ studentId: s._id });
        const submitted = await QuizResult.find({ studentId: s._id });
        return {
          _id: s._id,
          fname: s.fname,
          lname: s.lname,
          rollno: s.rollno,
          email: s.email,
          assignedQuizzesCount: assigned.length,
          submittedQuizzesCount: submitted.length,
          pendingQuizzesCount: Math.max(assigned.length - submitted.length, 0)
        };
      })
    );
    res.json(result);
  } catch (err) {
    console.error("students error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
