import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/register", formData);
      setMessage(res.data.message);
      setFormData({ fname: "", lname: "", email: "", password: "" });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error submitting form!");
      console.error(err);
    }
  };

  return (
    <div className="w-screen font-system-ui min-h-screen flex items-center justify-center bg-[#003d39]">

      <div className="bg-white rounded-3xl flex gap-10 shadow-lg p-5 w-[800px]">
        <div className="shadow-lg rounded-3xl flex items-center w-[50%]">
          <img src="https://png.pngtree.com/png-vector/20250620/ourmid/pngtree-3d-thinking-man-with-big-question-mark-png-image_16553087.png" alt="" />
        </div>
        <form className="w-[50%]" onSubmit={handleSubmit}>
          <h2 className="text-3xl text-center mb-6 text-gray-900">Registration</h2>

          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">First Name*</label>
            <input
              type="text"
              name="fname"
              placeholder="Enter First Name"
              required
              className="w-full border-b border-gray-400 focus:border-black outline-none py-2 text-gray-800"
              value={formData.fname}
              onChange={handleChange}
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Last Name*</label>
            <input
              type="text"
              name="lname"
              placeholder="Enter Last Name"
              required
              className="w-full border-b border-gray-400 focus:border-black outline-none py-2 text-gray-800"
              value={formData.lname}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Email*</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              required
              className="w-full border-b border-gray-400 focus:border-black outline-none py-2 text-gray-800"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-700 mb-1">Password*</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              required
              className="w-full border-b border-gray-400 focus:border-black outline-none py-2 text-gray-800"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="w-full text-center mt-8">
            <button
              type="submit"
              className="w-60 cursor-pointer bg-[#003d39] text-white text-lg font-bold py-2 rounded-md hover:bg-[#74EE66] hover:text-black transition duration-300 ease-in-out"
            >
              Create Account
            </button>
          </div>

          {/* Already registered */}
          <div className="text-center mt-4">
            <span>Already Registered? - </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="cursor-pointer text-blue-700 font-bold hover:underline transition"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const RegistrationForm = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     fname: "",
//     lname: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/register", formData);
//       alert(`Registration successful! Your Roll No: ${res.data.rollno}`);
//       setFormData({ fname: "", lname: "", email: "", password: "" });
//       navigate("/login");
//     } catch (err) {
//       alert(err.response?.data?.message || "Error registering user");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-[#003d39]">
//       <form
//         className="bg-white p-8 rounded-xl shadow-lg w-[400px]"
//         onSubmit={handleSubmit}
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

//         <input
//           type="text"
//           name="fname"
//           placeholder="First Name"
//           value={formData.fname}
//           onChange={handleChange}
//           required
//           className="w-full mb-4 p-2 border-b border-gray-400 outline-none"
//         />

//         <input
//           type="text"
//           name="lname"
//           placeholder="Last Name"
//           value={formData.lname}
//           onChange={handleChange}
//           required
//           className="w-full mb-4 p-2 border-b border-gray-400 outline-none"
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           className="w-full mb-4 p-2 border-b border-gray-400 outline-none"
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//           className="w-full mb-6 p-2 border-b border-gray-400 outline-none"
//         />

//         <button
//           type="submit"
//           className="w-full py-2 bg-[#003d39] text-white font-bold rounded hover:bg-[#74EE66] hover:text-black transition"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegistrationForm;
