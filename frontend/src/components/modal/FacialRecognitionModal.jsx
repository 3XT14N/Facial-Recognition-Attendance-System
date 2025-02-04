import React, { useState, useEffect, useRef } from "react";

const FacialRecognitionModal = ({ onRecognize, onClose }) => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Get available media devices (cameras)
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      setCameras(videoDevices);

      // Set default camera to the first available camera
      if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    });

    return () => {
      // Cleanup stream when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (selectedCamera) {
      // Stop any previous stream before starting a new one
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Start the camera stream for the selected camera
      navigator.mediaDevices
        .getUserMedia({ video: { deviceId: selectedCamera } })
        .then((newStream) => {
          setStream(newStream);
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
          }
        })
        .catch((error) => {
          console.error("Error accessing the camera", error);
        });
    }
  }, [selectedCamera]);

  const handleStartRecognition = () => {
    setIsRecognizing(true);
    // Simulate the recognition process
    setTimeout(() => {
      if (onRecognize) onRecognize();
      setIsRecognizing(false);
    }, 3000); // Simulating a 3-second recognition process
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h4 className="text-xl font-semibold text-center text-blue-600 mb-4">
          Facial Recognition for Attendance
        </h4>

        <div className="mb-4">
          <label htmlFor="cameraSelect" className="block text-lg font-semibold">
            Select Camera:
          </label>
          <select
            id="cameraSelect"
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${camera.deviceId}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-md"
            style={{ maxHeight: "300px" }}
          ></video>
        </div>

        <button
          onClick={handleStartRecognition}
          disabled={isRecognizing}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          {isRecognizing ? "Recognizing..." : "Start Facial Recognition"}
        </button>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
        >
          Close Recognition
        </button>
      </div>
    </div>
  );
};

export default FacialRecognitionModal;
