import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import classesJson from "../../data/classes.json"; // Import classes JSON
import subjectsJson from "../../data/subjects.json"; // Import subjects JSON
import attendanceJson from "../../data/attendance.json"; // Import attendance JSON

// Register components for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const ProfessorDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [professorName, setProfessorName] = useState("");

  useEffect(() => {
    const professorId = Number(localStorage.getItem("professorId")); // Assume professorId is stored in localStorage
    const name = localStorage.getItem("professorName"); // Get professor's name
    setProfessorName(name);

    // Filter classes assigned to the professor
    const professorClasses = classesJson.classes.filter((classItem) => {
      const subject = subjectsJson.subjects.find(
        (subj) => subj.id === classItem.subjectId && subj.professorId === professorId
      );
      return !!subject;
    });
    setClasses(professorClasses);

    if (professorClasses.length > 0) {
      const defaultClass = professorClasses[0];
      setSelectedClass(defaultClass);
      generateAttendanceData(defaultClass);
    }
  }, []);

  const generateAttendanceData = (classItem) => {
    if (!classItem) return;

    // Filter attendance records for the selected class
    const attendanceRecord = attendanceJson.attendance.find(
      (record) => record.classId === classItem.id
    );

    if (attendanceRecord) {
      const attendance = attendanceRecord.records.map((record) => ({
        studentId: record.studentId,
        status: record.status,
      }));
      setAttendanceData(attendance);
    } else {
      setAttendanceData([]);
    }
  };

  const handleClassChange = (e) => {
    const selected = classes.find((cls) => cls.id === Number(e.target.value));
    setSelectedClass(selected);
    generateAttendanceData(selected);
  };

  const totalStudents = attendanceData.length;
  const presentCount = attendanceData.filter((record) => record.status === "present").length;
  const absentCount = totalStudents - presentCount;

  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [presentCount, absentCount],
        backgroundColor: ["#4CAF50", "#FF6347"],
        hoverBackgroundColor: ["#45a049", "#ff503d"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${selectedClass?.classCode || "Class"} Attendance Overview`,
      },
    },
  };

  return (
    <div className="container mx-auto p-0 max-w-screen-lg space-y-8">

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Class Selector */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold mb-4">Select Class</h4>
          <select
            onChange={handleClassChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.classCode}
              </option>
            ))}
          </select>
        </div>

        {/* Attendance Overview */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold mb-4">Class Attendance Overview</h4>
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex justify-center lg:w-1/2">
              <Pie data={pieData} options={chartOptions} className="max-w-md" />
            </div>
            <div className="lg:w-1/2 lg:ml-6 space-y-4">
              <p className="text-lg">
                Total Students: <span className="font-bold text-blue-600">{totalStudents}</span>
              </p>
              <p className="text-lg">
                Present: <span className="font-bold text-green-600">{presentCount}</span>
              </p>
              <p className="text-lg">
                Absent: <span className="font-bold text-red-600">{absentCount}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Attendance Data */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h4 className="text-xl font-semibold mb-4">Students Attendance</h4>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 font-medium">Student ID</th>
              <th className="px-4 py-2 font-medium">Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="px-4 py-2">{record.studentId}</td>
                <td className="px-4 py-2">
                  {record.status === "present" ? (
                    <span className="text-green-600 font-bold">Present</span>
                  ) : (
                    <span className="text-red-600 font-bold">Absent</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
