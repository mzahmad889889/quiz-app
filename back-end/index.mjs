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

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quizDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// -------------------- MODELS --------------------

// USERS (Students & Admin)
const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  rollno: Number,
  role: { type: String, default: "student" } // "student" or "admin"
});
const User = mongoose.model("User", userSchema);

// QUESTIONS
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  createdAt: { type: Date, default: Date.now },
});
const Question = mongoose.model("Question", questionSchema);

// ALLOCATED QUIZZES
const allocatedQuizSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  allocatedAt: { type: Date, default: Date.now },
});
const AllocatedQuiz = mongoose.model("AllocatedQuiz", allocatedQuizSchema);

// QUIZ RESULTS
const quizResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "AllocatedQuiz" },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selectedOption: Number,
    },
  ],
  score: Number,
  totalQuestions: Number,
  submittedAt: { type: Date, default: Date.now },
});
const QuizResult = mongoose.model("QuizResult", quizResultSchema);

// ------------------ FILE UPLOAD CONFIG ------------------
const upload = multer({ dest: "uploads/" });

// ------------------ ROUTES ------------------

app.post("/api/upload-questions", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "CSV required" });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        // Map CSV rows to Question objects
        const questionsToInsert = results
          .map(row => {
            const { question, option1, option2, option3, option4, correctAnswer } = row;
            if (!question || !option1 || !option2 || !option3 || !option4) return null;
            return {
              question,
              options: [option1, option2, option3, option4],
              correctAnswer: Number(correctAnswer) || 0
            };
          })
          .filter(Boolean); // Remove null rows

        // Bulk insert all questions at once
        const insertedQuestions = await Question.insertMany(questionsToInsert);

        // Delete temp file
        fs.unlinkSync(req.file.path);

        res.json({ message: "Questions uploaded", questions: insertedQuestions });
      } catch (err) {
        console.error("CSV upload error:", err);
        res.status(500).json({ message: "Error uploading CSV", error: err.message });
      }
    });
});

// ------------------ EXISTING ROUTES ------------------

// ADMIN dashboard summary route (exclude admins from student counts)
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

// USER (STUDENT) AUTH / REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;
    if (!fname || !lname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const last = await User.findOne({ role: "student" }).sort({ rollno: -1 });
    const newRoll = last ? last.rollno + 1 : 1001;

    const user = new User({
      fname,
      lname,
      email,
      password,
      rollno: newRoll,
      role: "student"
    });

    await user.save();

    res.json({
      message: "Student Registered",
      rollno: newRoll,
      userId: user._id
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

// ... REST OF YOUR EXISTING ROUTES ...

app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email, password, role });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        rollno: user.rollno,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ALLOCATE QUIZ
app.post("/api/allocate", async (req, res) => {
  try {
    const { studentId, questionCount } = req.body;
    if (!studentId) return res.status(400).json({ message: "studentId is required" });

    const total = await Question.countDocuments();
    if (total === 0) return res.status(400).json({ message: "No questions available" });

    const size = Math.min(Number(questionCount) || 10, total);
    const questions = await Question.aggregate([{ $sample: { size } }]);
    const ids = questions.map(q => q._id);

    const alloc = await new AllocatedQuiz({ studentId, questions: ids }).save();
    // populate both studentId and questions to return a friendly allocation object
    const populated = await AllocatedQuiz.findById(alloc._id)
      .populate("studentId", "fname lname email rollno")
      .populate("questions", "question options correctAnswer");

    res.json({ message: "Quiz allocated", allocation: populated });
  } catch (err) {
    console.error("Allocate error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

// STUDENT ASSIGNED QUIZZES - NEW
// returns allocations with populated questions and a submitted flag
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

// GET quiz questions by allocation id (quizId = allocation _id)
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

// SUBMIT QUIZ
app.post("/api/submit-quiz", async (req, res) => {
  try {
    const { studentId, quizId, answers, score, totalQuestions } = req.body;
    if (!studentId || !quizId) return res.status(400).json({ message: "studentId and quizId required" });

    // prevent duplicate
    const already = await QuizResult.findOne({ studentId, quizId });
    if (already) {
      return res.status(400).json({ message: "Quiz already submitted" });
    }

    const result = new QuizResult({ studentId, quizId, answers, score, totalQuestions });
    await result.save();

    res.json({ message: "Quiz submitted successfully", result });
  } catch (err) {
    console.error("submit-quiz error:", err);
    res.status(500).json({ message: "Error submitting quiz", error: err });
  }
});

// ADMIN: Get all quiz results (shaped)
app.get("/api/student-quiz-history", async (req, res) => {
  try {
    const historyRaw = await QuizResult.find().sort({ submittedAt: -1 }).populate("studentId").populate({
      path: "quizId",
      populate: { path: "questions", select: "question options correctAnswer" }
    });

    const shaped = historyRaw.map(h => {
      const student = h.studentId || {};
      const allocation = h.quizId || {};
      const questions = Array.isArray(allocation.questions) ? allocation.questions : [];
      return {
        _id: h._id,
        student: {
          _id: student._id,
          name: `${student.fname || ""} ${student.lname || ""}`.trim() || "Unknown Student",
          email: student.email || "", rollno: student.rollno || ""
        },
        quiz: {
          _id: allocation._id,
          title: allocation.title || `Quiz (${questions.length} Qs)`,
          totalQuestions: questions.length,
        },
        score: h.score ?? 0,
        totalQuestions: h.totalQuestions ?? (questions.length || 0),
        submittedAt: h.submittedAt,
        answers: h.answers || []
      };
    });

    res.json(shaped);
  } catch (err) {
    console.error("student-quiz-history error:", err);
    res.status(500).json({ message: "Server error while fetching quiz history", error: err });
  }
});

// STUDENT: quiz history
app.get("/api/quiz-history/:studentId", async (req, res) => {
  try {
    const history = await QuizResult.find({ studentId: req.params.studentId })
      .sort({ submittedAt: -1 })
      .populate("studentId", "fname lname rollno email")
      .populate({
        path: "quizId",
        populate: { path: "questions", select: "question options correctAnswer" },
      });

    // shape to be convenient for frontend
    const shaped = history.map(h => {
      const student = h.studentId || {};
      const allocation = h.quizId || {};
      const questions = Array.isArray(allocation.questions) ? allocation.questions : [];
      return {
        _id: h._id,
        student: {
          _id: student._id,
          name: `${student.fname || ""} ${student.lname || ""}`.trim() || "Unknown Student",
          email: student.email || ""
        },
        quiz: {
          _id: allocation._id,
          questions,
        },
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

// STUDENTS LIST (only students, exclude admins)
app.get("/api/students", async (req, res) => {
  try {
    // fetch only users with role: "student"
    const students = await User.find({ role: "student" }, "fname lname rollno email");

    const result = await Promise.all(
      students.map(async (s) => {
        const assigned = await AllocatedQuiz.find({ studentId: s._id }).populate("questions");
        const submitted = await QuizResult.find({ studentId: s._id });

        return {
          _id: s._id,
          fname: s.fname,
          lname: s.lname,
          rollno: s.rollno,
          email: s.email,
          assignedQuizzesCount: assigned.length,
          submittedQuizzesCount: submitted.length,
          pendingQuizzesCount: Math.max(assigned.length - submitted.length, 0),
          assignedQuizzes: assigned,
          submittedQuizzes: submitted
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("students error:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
