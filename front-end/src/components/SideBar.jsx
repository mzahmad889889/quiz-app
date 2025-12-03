import React from "react";
import { CiUser, CiClock2 } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";

const SideBar = ({ setActiveSection }) => {
  return (
    <div className="w-64 bg-[#015c56] h-full text-white p-6">
      <div className="text-center mb-10">
        <img
          src="/avatar.png"
          className="w-24 h-24 mx-auto rounded-full"
          alt="Profile"
        />
        <h2 className="text-xl font-semibold mt-3">Student</h2>
      </div>

      <ul className="space-y-6">

        <li
          className="flex items-center space-x-3 cursor-pointer hover:text-gray-300"
          onClick={() => setActiveSection("Dashboard")}
        >
          <MdOutlineDashboard size={22} />
          <span>Dashboard</span>
        </li>

        <li
          className="flex items-center space-x-3 cursor-pointer hover:text-gray-300"
          onClick={() => setActiveSection("Profile")}
        >
          <CiUser size={22} />
          <span>Profile</span>
        </li>

        <li
          className="flex items-center space-x-3 cursor-pointer hover:text-gray-300"
          onClick={() => setActiveSection("History")}
        >
          <CiClock2 size={22} />
          <span>History</span>
        </li>

      </ul>
    </div>
  );
};

export default SideBar;
