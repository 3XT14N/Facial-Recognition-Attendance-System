import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StudentDetails = () => {
  const location = useLocation();
  const { studentId, attendanceHistory = [] } = location.state || {};
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState(attendanceHistory);

  if (!studentId) {
    return <div>No student selected.</div>;
  }

  const handleAttendanceChange = (index, status) => {
    const updatedAttendance = [...attendance];
    updatedAttendance[index].status = status;
    setAttendance(updatedAttendance);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          {studentId}'s Attendance
        </h3>

        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{record.date}</td>
                <td className="border border-gray-300 px-4 py-2">{record.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleAttendanceChange(index, "Present")}
                    className="bg-green-500 text-white px-2 py-1 rounded-md mr-2"
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(index, "Absent")}
                    className="bg-red-500 text-white px-2 py-1 rounded-md mr-2"
                  >
                    Absent
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(index, "Excused")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-md"
                  >
                    Excused
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Back to Class Details
        </button>
      </div>
    </div>
  );
};

export default StudentDetails;
