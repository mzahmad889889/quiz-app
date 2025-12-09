import React, { useContext } from "react";
import { UserContext } from "../components/UserContext";

const Profile = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-bold text-red-500">Student Profile Not Available</h1>
      </div>
    );
  }

  const fullName = `${user.fname} ${user.lname}`;

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Student Profile</h1>

      <div className="space-y-3 text-lg">
        <p><strong>Name:</strong> {fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Roll Number:</strong> {user.rollno}</p>
      </div>
    </div>
  );
};

export default Profile;
