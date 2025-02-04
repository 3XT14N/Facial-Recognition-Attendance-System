import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import QRCodeModal from "../../components/modal/QRCodeModal";
import CameraModal from "../../components/modal/CameraModal";
import FacialRecognitionModal from "../../components/modal/FacialRecognitionModal";
import ImageUploadModal from "../../components/modal/ImageUploadModal";
import StudentList from "../../components/professorsComponent/StudentList";
import accountsData from "../../defaultAccounts.json"; // Assuming you have accounts data
import attendanceData from "../../data/attendance.json"; // Importing attendance.json

const ClassDetailsPage = () => {
  const location = useLocation();
  const { classItem } = location.state || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showFacialRecognitionModal, setShowFacialRecognitionModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [subjectCode] = useState(`SUB-${classItem?.id}-${Date.now().toString().slice(-4)}`);
  const navigate = useNavigate(); // To navigate to other pages

  // Map student IDs to names using accounts data
  const studentsMap = accountsData.accounts.reduce((acc, account) => {
    acc[account.id] = account.name;
    return acc;
  }, {});

  if (!classItem) {
    return <div>No class selected.</div>;
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = classItem.students
    .map((studentId) => studentsMap[studentId]) // Map student IDs to names
    .filter((studentName) =>
      String(studentName).toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleStudentClick = (studentId) => {
    // Extract attendance history for the selected student and class
    const attendanceHistory = attendanceData.attendance
      .filter((entry) => entry.classId === classItem.id) // Filter by class ID
      .map((entry) => ({
        date: entry.date,
        status: entry.records.find((record) => record.studentId === studentId)?.status || "No record",
      }));

    // Navigate to the student page with their attendance history
    navigate(`/student/${studentId}`, {
      state: { studentId, attendanceHistory },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-6 mt-16">
        <h3 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          Class: {classItem.classCode}
        </h3>

        {/* QR Code Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowQRCodeModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Show QR Code & Subject Code
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Student List */}
        <StudentList
          students={filteredStudents.map((studentName, index) => ({
            name: studentName,
            id: classItem.students[index], // Use the same index to get student ID
          }))}
          onStudentClick={(student) => handleStudentClick(student.id)}
        />

        {/* Attendance Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setShowFacialRecognitionModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Start Facial Recognition
          </button>
          <button
            onClick={() => setShowCameraModal(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300"
          >
            Use Device Camera
          </button>
          <button
            onClick={() => setShowImageUploadModal(true)}
            className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition duration-300"
          >
            Upload Class Picture
          </button>
        </div>

        {/* Modals */}
        {showQRCodeModal && (
          <QRCodeModal
            subjectCode={subjectCode}
            onCopyCode={() => navigator.clipboard.writeText(subjectCode)}
            onShareQRCode={() => alert("Sharing feature not implemented")}
            onClose={() => setShowQRCodeModal(false)}
          />
        )}
        {showCameraModal && <CameraModal onCapture={() => alert("Capture triggered!")} onClose={() => setShowCameraModal(false)} />}
        {showFacialRecognitionModal && (
          <FacialRecognitionModal onRecognize={() => alert("Recognition completed!")} onClose={() => setShowFacialRecognitionModal(false)} />
        )}
        {showImageUploadModal && (
          <ImageUploadModal onUpload={(image) => alert(`Uploaded image: ${image.name}`)} onClose={() => setShowImageUploadModal(false)} />
        )}

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Class Manager
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailsPage;
