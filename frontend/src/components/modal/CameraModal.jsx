import React, { useState, useEffect, useRef } from "react";

const CameraModal = ({ onCapture, onClose }) => {
  const [hasCamera, setHasCamera] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);  // Reference to the video element

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

    if (!videoStream) {
      startCamera();
    }

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const handleCapture = () => {
    if (onCapture) onCapture();
  };

  if (!hasCamera) {
    return <div>No camera access or camera not found.</div>;
  }

  return (
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
          onClick={onClose}
          className="mt-4 w-full bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
        >
          Close Camera
        </button>
      </div>
    </div>
  );
};

export default CameraModal;
