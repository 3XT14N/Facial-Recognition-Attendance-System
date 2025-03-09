import React from "react";
import { useSelector } from "react-redux"; // Import useSelector
import StudentDashboard from "../components/studentsComponent/StudentDashboard";
import ProfessorDashboard from "../components/professorsComponent/ProfessorDashboard";

const Dashboard = () => {
  // Retrieve role from Redux store
  const role = useSelector((state) => state.user?.role);

  return (
    <div className="container mx-auto p-6 max-w-full min-h-screen">
      {/* Conditional Rendering for Student/Professor */}
      <div className="space-y-6">
        {role === "student" ? (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-full min-h-screen">
            <StudentDashboard />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-full min-h-screen">
            <ProfessorDashboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;