import React from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import NotFound from "./pages/NotFoundPage";
import NotificationsPages from "./pages/NotificationsPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Access user data from Redux store
  const user = useSelector((state) => state.user);

  // Handle sign-out
  const handleSignOut = () => {
    dispatch({ type: "LOGOUT" }); // Dispatch logout action
    navigate("/login");
  };

  return (
    <>
      {/* Show Navbar only if user is authenticated */}
      {user && location.pathname !== "/login" && <Navbar onSignOut={handleSignOut} />}

      <div className="max-w-7xl mx-auto p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/my-classes/join-class" element={<JoinClass />} />
            <Route path="/my-classes" element={<MyClasses />} />
            <Route path="/manage-attendance/:id" element={<ManageAttendance />} />
            <Route path="/class-attendance/*" element={<Class_Attendance />} />
            <Route path="/class-details" element={<ClassDetailsPage />} />
            <Route path="/class-details/:id" element={<ClassDetailsPage />} />
            <Route path="/user-profile/*" element={<UserProfile />} />
            <Route path="/student/:id" element={<StudentDetails />} />
            <Route path="/notifications" element={<NotificationsPages />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;