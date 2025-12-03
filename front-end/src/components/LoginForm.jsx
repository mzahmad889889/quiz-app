import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();

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
      alert("Please select Teacher or Student");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", formData);

      alert("Login Successful!");
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect based on selected role
      if (formData.role === "teacher") {
        navigate("/admin");
      } else {
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

          {/* Email Input */}
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

          {/* Password Input */}
          <div className="mb-6">
            <label className="block font-bold text-gray-700 mb-1">
              Password*
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter password"
              className="w-full border-b border-gray-400 focus:border-black outline-none py-2 text-gray-800"
              onChange={handleChange}
            />

            <div className="mt-4 flex gap-4">
              <p><strong>Sign-in As: </strong></p>
              <label>
                <input className="mr-1"
                  type="radio"
                  name="role"
                  value="teacher"
                  onChange={handleChange}
                />
                Teacher
              </label>

              <label>
                <input className="mr-1"
                  type="radio"
                  name="role"
                  value="student"
                  onChange={handleChange}
                />
                Student
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-center mt-10 mb-5">
            <button
              type="submit"
              className="w-60 cursor-pointer bg-[#003d39] text-white text-lg font-bold py-2 rounded-md hover:bg-[#74EE66] hover:text-black duration-300"
            >
              Sign In
            </button>
          </div>

          {/* Sign-Up Link */}
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
