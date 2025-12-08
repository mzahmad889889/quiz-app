import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      alert("Please select Admin or Student");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", formData);
      const userFromBackend = res.data.user;

      if (formData.role === "admin") {
        if (userFromBackend.role !== "admin") {
          alert("This user is not an admin!");
          return;
        }
        localStorage.setItem("adminUser", JSON.stringify(userFromBackend));
        navigate("/admin");
      } else {
        if (userFromBackend.role !== "student") {
          alert("This user is not a student!");
          return;
        }
        // ✅ Save student to context + localStorage
        login(userFromBackend);
        navigate("/student");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-screen font-system-ui min-h-screen flex items-center justify-center bg-[#003d39]">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-[400px]">
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl text-center mb-6 text-gray-900">Sign In</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block font-bold text-gray-700 mb-1">Email*</label>
            <input
              type="email"
              name="email"
              required
              placeholder="example@gmail.com"
              className="w-full border-b border-gray-400 focus:border-black outline-none py-2 text-gray-800"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block font-bold text-gray-700 mb-1">Password*</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter password"
              className="w-full border-b border-gray-400 focus:border-black outline-none py-2 text-gray-800"
              onChange={handleChange}
            />
          </div>

          {/* Role Selection */}
          <div className="mb-6 flex gap-4 items-center">
            <p><strong>Sign-in As: </strong></p>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                onChange={handleChange}
                className="mr-1"
              />
              Admin
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="student"
                onChange={handleChange}
                className="mr-1"
              />
              Student
            </label>
          </div>

          <div className="w-full flex justify-center mt-10 mb-5">
            <button
              type="submit"
              className="w-60 cursor-pointer bg-[#003d39] text-white text-lg font-bold py-2 rounded-md hover:bg-[#74EE66] hover:text-black duration-300"
            >
              Sign In
            </button>
          </div>

          <div className="text-center">
            <span>Don't have an account? - </span>
            <button
              type="button"
              onClick={() => navigate("/registration")}
              className="cursor-pointer text-blue-700 font-bold hover:underline"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
