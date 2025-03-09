import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const UserProfile = () => {
  const user = useSelector((state) => state.user); // Get user from Redux state
  const [userData, setUserData] = useState(user || null);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const response = await axios.get("/api/users/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    const fetchUserPhoto = async () => {
      if (user && user.userId) {
        setPhotoUrl(`/api/user/photo/${user.userId}`); // Direct URL to Flask API
      }
    };

    fetchUserData();
    fetchUserPhoto();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        {userData ? (
          <div className="text-center">
            {photoUrl && (
              <img
                src={photoUrl}
                alt="User Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-300"
                onError={(e) => {
                  e.target.src = "/default-profile.jpg"; // Fallback image
                }}
              />
            )}
            <h2 className="text-2xl font-semibold">{userData.userName}</h2>
            <p className="text-gray-500">{userData.email}</p>
            <p className="text-gray-500">Role: {userData.role === "student" ? "Student" : "Professor"}</p>

            {userData.role === "student" && userData.studentId && (
              <p className="text-gray-500 font-semibold">Student ID: {userData.studentId}</p>
            )}
            {userData.role === "professor" && userData.profId && (
              <p className="text-gray-500 font-semibold">Professor ID: {userData.profId}</p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading user profile...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
