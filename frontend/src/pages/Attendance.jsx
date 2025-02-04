import React, { useState, useEffect } from "react";
import attendanceData from "../data/attendance.json"; // Import the JSON file

const Attendance = ({ role, classId }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the logged-in student's ID from localStorage
  const studentId = role === "student" ? localStorage.getItem("studentId") : null;

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setAttendanceRecords(attendanceData.attendance);
      setLoading(false);
    }, 500); // Simulated delay
  }, []);

  // Filter attendance based on the role
  const studentAttendance = attendanceRecords
    .filter((record) => record.records.some((r) => r.studentId === parseInt(studentId)))
    .map((record) => ({
      date: record.date,
      status: record.records.find((r) => r.studentId === parseInt(studentId)).status,
    }));

  const classAttendance = attendanceRecords.filter(
    (record) => record.classId === classId
  );

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">
        {role === "student" ? "Your Attendance" : `Class Attendance for Class ID: ${classId}`}
      </h2>
      {loading ? (
        <p>Loading attendance data...</p>
      ) : role === "student" ? (
        <div>
          <p className="text-lg mb-4">Your attendance history:</p>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentAttendance.map((record, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{record.date}</td>
                  <td
                    className={`border border-gray-300 px-4 py-2 ${
                      record.status === "present" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {record.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          {classAttendance.length > 0 ? (
            classAttendance.map((record, index) => (
              <div key={index} className="mb-6">
                <h3 className="font-bold text-lg">Date: {record.date}</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Student ID</th>
                      <th className="border border-gray-300 px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.records.map((r, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-300 px-4 py-2">{r.studentId}</td>
                        <td
                          className={`border border-gray-300 px-4 py-2 ${
                            r.status === "present" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {r.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>No attendance records found for this class.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
