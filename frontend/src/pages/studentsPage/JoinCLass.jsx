import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const JoinClass = () => {
  const [scannedData, setScannedData] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [file, setFile] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false); // State to control QR scanner visibility
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const mediaStream = useRef(null);

  // Handle QR Code scan result
  const handleScan = (result) => {
    if (result) {
      setScannedData(result.text);
      stopScanner(); // Stop scanner after scan
    }
  };

  // Start QR Code scanning
  const startScanner = async () => {
    try {
      codeReader.current = new BrowserMultiFormatReader();
      mediaStream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Default to back camera
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream.current;
      }

      codeReader.current.decodeFromVideoDevice(null, videoRef.current, handleScan).catch((err) => console.error(err));
    } catch (err) {
      console.error("Error accessing the camera:", err);
    }
  };

  // Stop QR Code scanner
  const stopScanner = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }

    if (mediaStream.current) {
      const tracks = mediaStream.current.getTracks();
      tracks.forEach(track => track.stop());
      mediaStream.current = null;
    }
    setIsScannerOpen(false); // Close scanner modal after stopping
  };

  // Handle file input for QR Code upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          const codeReader = new BrowserMultiFormatReader();
          codeReader
            .decodeFromImage(image)
            .then((result) => setScannedData(result.text))
            .catch((err) => console.error('QR Code not detected in image:', err));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle manual code input
  const handleCodeInput = (event) => {
    setInputCode(event.target.value);
  };

  // Join class with the scanned code
  const joinClass = () => {
    if (scannedData || inputCode) {
      const classCode = scannedData || inputCode;
      console.log(`Joining class with code: ${classCode}`);
      // Add your logic to join the class here, like an API request
      // For now, we're just logging the class code
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Join a New Class</h2>

        {/* Scanned Data */}
        {scannedData && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="font-semibold text-blue-600">Scanned Data:</p>
            <p>{scannedData}</p>
          </div>
        )}

        {/* Manual Code Input */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Enter Class Code:</label>
          <input
            type="text"
            value={inputCode}
            onChange={handleCodeInput}
            placeholder="Class Code"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={joinClass}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-700 transition duration-300"
          >
            Join Class
          </button>
        </div>

        {/* QR Code Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Upload QR Code Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full border border-gray-300 px-4 py-2 rounded-md mb-2"
          />
          <p className="text-sm text-gray-600">Upload a QR code image to join a class</p>
        </div>

        {/* Button to open QR scanner */}
        <div className="mb-4">
          <button
            onClick={() => {
              setIsScannerOpen(true);  // Only show scanner when button is clicked
              startScanner();          // Start scanner
            }}
            className="w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Scan QR Code to Join Class
          </button>
        </div>

        {/* QR Code Scanner Modal */}
        {isScannerOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <video ref={videoRef} style={{ width: '100%' }} autoPlay muted />
              <button
                onClick={stopScanner}
                className="mt-4 w-full bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
              >
                Stop Scanner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinClass;
