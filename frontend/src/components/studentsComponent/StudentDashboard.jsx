import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import attendanceData from "../../data/attendance.json";
import historyData from "../../data/history.json";

// Register ChartJS components
ChartJS.register(ArcElement, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week"); // Default to weekly
  const [attendanceSummary, setAttendanceSummary] = useState(0);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const loggedInStudentId = 1; // Replace with the actual logged-in student ID

  // Options for the different periods
  const timePeriods = {
    week: 7,
    month: 30,
    firstSemester: 182, // ~6 months
    secondSemester: 183, // ~6 months
    year: 365,
  };

  // Calculate attendance based on the selected period
  useEffect(() => {
    const calculateAttendance = () => {
      const now = new Date();
      const studentRecords = attendanceData.attendance.flatMap((classRecord) =>
        classRecord.records
          .filter((record) => record.studentId === loggedInStudentId)
          .map((record) => ({
            date: new Date(classRecord.date),
            status: record.status,
          }))
      );

      const periodDays = timePeriods[selectedPeriod];
      const attendanceCount = studentRecords.reduce((count, record) => {
        const daysDifference = (now - record.date) / (1000 * 60 * 60 * 24); // Convert ms to days
        return record.status === "present" && daysDifference <= periodDays ? count + 1 : count;
      }, 0);

      setAttendanceSummary(attendanceCount);
    };

    const getAttendanceHistory = () => {
      const studentHistory = historyData.history.filter(
        (history) => history.studentId === loggedInStudentId
      );
      setAttendanceHistory(studentHistory);
    };

    calculateAttendance();
    getAttendanceHistory();
  }, [selectedPeriod, loggedInStudentId]);

  // Pie chart data
  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendanceSummary, 10 - attendanceSummary], // Assuming 10 total classes for simplicity
        backgroundColor: ["#4CAF50", "#FF6384"],
        hoverBackgroundColor: ["#45A049", "#FF4364"],
      },
    ],
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      title: {
        display: true,
        text: `Attendance for ${selectedPeriod === "firstSemester"
          ? "First Semester"
          : selectedPeriod === "secondSemester"
          ? "Second Semester"
          : selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}`,
      },
    },
  };

  // Handle period selection
  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
  };

  // Render attendance history
  const renderHistory = () => {
    return attendanceHistory.map((history, index) => (
      <div key={index} className="bg-white shadow-md p-4 mb-4 rounded-lg">
        <h5 className="text-lg font-semibold mb-2">Class ID: {history.classId}</h5>
        <ul>
          {history.actions.map((action, idx) => (
            <li key={idx} className="text-gray-700">
              <span className="font-semibold">{new Date(action.date).toLocaleDateString()}:</span> {action.action}
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side: Attendance Summary and History */}
        <div className="space-y-6">
          {/* Attendance Summary */}
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <p className="text-lg">
              You have attended {attendanceSummary} classes in the selected period ({selectedPeriod === "firstSemester"
                ? "First Semester"
                : selectedPeriod === "secondSemester"
                ? "Second Semester"
                : selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
              ).
            </p>
            <p className="text-sm text-gray-600">Keep it up!</p>
          </div>

          {/* Attendance History */}
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Attendance History</h4>
            {renderHistory()}
          </div>
        </div>

        {/* Right side: Pie Chart and Time Period Navbar */}
        <div>
          <div className="bg-white shadow-lg p-6 rounded-lg">
            {/* Navbar for Time Periods */}
            <div className="flex justify-between space-x-4 mb-6">
              {Object.keys(timePeriods).map((period) => (
                <button
                  key={period}
                  className={`py-2 px-4 rounded-lg text-sm ${selectedPeriod === period ? "bg-blue-600 text-white" : "bg-white text-gray-800 hover:bg-gray-200"}`}
                  onClick={() => handlePeriodClick(period)}
                >
                  {period === "firstSemester"
                    ? "First Semester"
                    : period === "secondSemester"
                    ? "Second Semester"
                    : period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>

            {/* Pie Chart */}
            <h4 className="text-lg font-semibold mb-4">Attendance Breakdown</h4>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;