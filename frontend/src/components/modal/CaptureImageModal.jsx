import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const CaptureImageModal = ({ isOpen, onClose, onCapture }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [faceDetectionTime, setFaceDetectionTime] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadFaceApiModels();
    }
  }, [isOpen]);

  // Load Face-API models
  const loadFaceApiModels = async () => {
    setLoading(true);
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      console.log("✅ Face-API Models Loaded!");
      setModelsLoaded(true);
    } catch (error) {
      console.error("❌ Error loading Face-API models:", error);
      setError("Failed to load face detection models. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let animationFrameId;

    const detectFace = async () => {
      if (!modelsLoaded || !webcamRef.current || !canvasRef.current) return;

      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) {
        animationFrameId = requestAnimationFrame(detectFace);
        return;
      }

      const ctx = canvasRef.current.getContext("2d");
      const { videoWidth, videoHeight } = video;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      ctx.clearRect(0, 0, videoWidth, videoHeight);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

      const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());

      if (detection) {
        const { x, y, width, height } = detection.box;

        if (width > 80 && height > 80) {
          if (!faceDetected) {
            setFaceDetected(true);
            setFaceDetectionTime(Date.now());
          }

          if (faceDetectionTime && Date.now() - faceDetectionTime > 1500 && !capturing) {
            console.log("✅ Face Steady for 1.5s, Capturing...");
            captureImage(x, y, width, height);
          }

          ctx.strokeStyle = "green";
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);
        } else {
          resetFaceDetection();
        }
      } else {
        resetFaceDetection();
      }

      animationFrameId = requestAnimationFrame(detectFace);
    };

    if (modelsLoaded && isOpen) {
      detectFace();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [modelsLoaded, isOpen, faceDetected, faceDetectionTime, capturing]);

  const resetFaceDetection = () => {
    setFaceDetected(false);
    setFaceDetectionTime(null);
  };

  const captureImage = (x, y, width, height) => {
    if (webcamRef.current && !capturing) {
      setCapturing(true);

      const ctx = canvasRef.current.getContext("2d");
      const imageData = ctx.getImageData(x, y, width, height);

      const faceCanvas = document.createElement("canvas");
      faceCanvas.width = width;
      faceCanvas.height = height;
      const faceCtx = faceCanvas.getContext("2d");
      faceCtx.putImageData(imageData, 0, 0);

      const faceImage = faceCanvas.toDataURL("image/png");

      console.log("✅ Image Captured!");
      onCapture(faceImage);

      setTimeout(() => {
        setCapturing(false);
      }, 1000); // Allow time before next capture
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
        <h2 className="text-xl font-semibold mb-4">Capture Your Photo</h2>

        {loading && <p className="text-blue-500">Loading face detection models...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="relative">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={{ facingMode: "user", width: 640, height: 480 }}
            className="rounded-lg"
            onUserMediaError={() => setError("Failed to access the camera. Please allow camera access.")}
          />
          <canvas ref={canvasRef} className="absolute top-0 left-0" />
        </div>

        <p className={`mt-4 text-lg font-bold ${faceDetected ? "text-green-500" : "text-red-500"}`}>
          {faceDetected ? "🟢 Face Detected (Stay Still)" : "🔴 No Face Detected"}
        </p>

        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CaptureImageModal;