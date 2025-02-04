import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import LoginPage from "./pages/LoginPage";
import MyClasses from "./pages/professorsPage/MyClass";
import JoinClass from "./pages/studentsPage/JoinCLass";
import Class_Attendance from "./pages/professorsPage/ClassManager";
import ClassDetailsPage from "./pages/professorsPage/ClassDetailsPage";
import ManageAttendance from "./pages/professorsPage/ManageAttendance";
import UserProfile from "./pages/UserProfile";
import StudentDetails from "./pages/professorsPage/StudentDetails";
import NotFound from "./pages/NotFoundPage"; // Import 404 page
import NotificationsPages from "./pages/NotificationsPage"; // Import NotificationsPage

const App = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "student");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("role")) {
      // Redirect to login if no role is found in localStorage
      navigate("/login");
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("role");
    setRole("student"); // Reset the role state
    navigate("/login"); // Use navigate for routing instead of window.location.href
  };

  return (
    <>
      {/* Conditionally render Navbar based on the current route */}
      {window.location.pathname !== "/login" && <Navbar role={role} onSignOut={handleSignOut} />}
      
      <div className="max-w-7xl mx-auto p-4">
        <Routes>
          {/* Define Routes based on user role */}
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<Dashboard role={role} />} />
          <Route path="/dashboard" element={<Dashboard role={role} />} />

          {/* Student and Professor specific routes */}
          {role === "student" ? (
            <>
              <Route path="/attendance" element={<Attendance role={role} />} />
              <Route path="/my-classes/join-class" element={<JoinClass role={role} />} /> 
              <Route path="/my-classes" element={<MyClasses role={role} />} />
            </>
          ) : role === "professor" ? (
            <>
              <Route path="/my-classes" element={<MyClasses role={role} />} />
              <Route path="/manage-attendance/:id" element={<ManageAttendance role={role} />} />
              <Route path="/class-attendance/*" element={<Class_Attendance role={role} />} />
              <Route path="/class-details" element={<ClassDetailsPage role={role} />} />
              <Route path="/class-details/:id" element={<ClassDetailsPage role={role} />} />
            </>
          ) : (
            // Handle other roles if needed
            <Route path="/manage-attendance/:id" element={<ManageAttendance role={role} />} />
          )}

          {/* Common routes for both student and professor */}
          <Route path="/user-profile/*" element={<UserProfile role={role} />} />
          <Route path="/student/:id" element={<StudentDetails role={role} />} />
          <Route path="/notifications" element={<NotificationsPages />} /> {/* New route */}
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
