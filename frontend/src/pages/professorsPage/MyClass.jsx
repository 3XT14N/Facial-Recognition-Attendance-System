import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import classesData from "../../data/classes.json";
import attendanceData from "../../data/attendance.json";
import historyData from "../../data/history.json";

// Set the root element for react-modal for accessibility
Modal.setAppElement("#root");

const MyClasses = () => {
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [joinClassModalOpen, setJoinClassModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cameraModalOpen, setCameraModalOpen] = useState(false);  // State for CameraModal
  const [hasCamera, setHasCamera] = useState(false);  // State for camera access
  const [videoStream, setVideoStream] = useState(null);  // Camera stream state
  const videoRef = useRef(null);  // Reference to the video element

  // Get studentId from localStorage
  const studentId = parseInt(localStorage.getItem("studentId"));

  useEffect(() => {
    if (studentId) {
      const filteredClasses = classesData.classes.filter((classItem) =>
        classItem.students.includes(studentId)
      );
      setJoinedClasses(filteredClasses);
    }
  }, [studentId]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setHasCamera(true);
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setHasCamera(false);
      }
    };

    if (cameraModalOpen && !videoStream) {
      startCamera();
    }

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraModalOpen, videoStream]);

  const handleClassClick = (classItem) => {
    if (!modalIsOpen) {
      setSelectedClass(classItem);

      const studentAttendance = attendanceData.attendance
        .filter((record) => record.classId === classItem.id)
        .map((record) => ({
          date: record.date,
          status:
            record.records.find((rec) => rec.studentId === studentId)?.status ||
            "No Record",
        }));

      setAttendanceRecords(studentAttendance);

      const studentHistory =
        historyData.history.find(
          (history) =>
            history.studentId === studentId && history.classId === classItem.id
        )?.actions || [];

      setAttendanceHistory(studentHistory);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedClass(null);
    setAttendanceRecords([]);
    setAttendanceHistory([]);
  };

  const handleJoinClass = () => {
    const classToJoin = classesData.classes.find(
      (classItem) => classItem.classCode === classCode
    );

    if (!classToJoin) {
      setErrorMessage("Class not found. Please check the class code.");
      return;
    }

    if (classToJoin.students.includes(studentId)) {
      setErrorMessage("You are already enrolled in this class.");
      return;
    }

    classToJoin.students.push(studentId);
    setJoinedClasses([...joinedClasses, classToJoin]);

    setClassCode("");
    setErrorMessage("");
    setJoinClassModalOpen(false);
  };

  const openCameraModal = () => {
    setCameraModalOpen(true);
  };

  const closeCameraModal = () => {
    setCameraModalOpen(false);
  };

  const handleCapture = () => {
    // Implement capture logic (capture a frame or trigger attendance)
    console.log("Capture image for attendance");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 mb-6">
        My Classes
      </h2>

      <button
        className="mb-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        onClick={() => setJoinClassModalOpen(true)}
      >
        Join a Class
      </button>

      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
        {joinedClasses.length > 0 ? (
          <ul className="list-disc pl-5">
            {joinedClasses.map((classItem) => (
              <li
                key={classItem.id}
                className="mb-4 cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleClassClick(classItem)}
              >
                {classItem.classCode} - {classItem.schedule}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            You haven't joined any classes yet. Please join a class.
          </p>
        )}
      </div>

      {/* Modal for Joining a Class */}
      <Modal
        isOpen={joinClassModalOpen}
        onRequestClose={() => setJoinClassModalOpen(false)}
        className="bg-white max-w-lg mx-auto my-10 p-6 rounded-lg shadow-lg w-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Join a Class</h2>
        <p className="mb-4 text-gray-600">
          Enter the class code provided by your professor or scan the QR code.
        </p>
        <input
          type="text"
          placeholder="Enter Class Code"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errorMessage && (
          <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
        )}
        <button
          className="mt-4 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
          onClick={openCameraModal} // Open Camera modal
        >
          Capture Image for Attendance
        </button>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setJoinClassModalOpen(false)}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleJoinClass}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Join Class
          </button>
        </div>
      </Modal>

      {/* Camera Modal */}
      {cameraModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h4 className="text-xl font-semibold text-center text-blue-600 mb-4">
              Use Device Camera for Attendance
            </h4>
            <div className="mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto border-2 border-gray-300 rounded-md"
              ></video>
            </div>
            <button
              onClick={handleCapture}
              className="w-full bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300"
            >
              Capture Image for Attendance
            </button>
            <button
              onClick={closeCameraModal}
              className="mt-4 w-full bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
            >
              Close Camera
            </button>
          </div>
        </div>
      )}

      {/* Modal for Class Details */}
      {selectedClass && modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="bg-white max-w-2xl mx-auto my-10 p-6 rounded-lg shadow-lg w-full"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-4">
            Class Details: {selectedClass.classCode}
          </h2>
          <p>
            <strong>Schedule:</strong> {selectedClass.schedule}
          </p>
          <p className="mt-4">
            <strong>Enrolled Students:</strong>{" "}
            {selectedClass.students.length} students
          </p>
        </Modal>
      )}
    </div>
  );
};

export default MyClasses;
