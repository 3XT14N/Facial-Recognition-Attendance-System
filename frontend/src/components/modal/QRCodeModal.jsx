import React from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeModal = ({ subjectCode, onCopyCode, onShareQRCode, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h4 className="text-lg font-semibold text-center mb-4">Join Class</h4>
        <div className="flex justify-center mb-4">
          <QRCodeSVG value={subjectCode} size={128} />
        </div>
        <p className="text-sm text-gray-700 text-center mb-4">
          Subject Code: <strong>{subjectCode}</strong>
        </p>
        <div className="flex justify-between gap-2">
          <button
            onClick={onCopyCode}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Copy Code
          </button>
          <button
            onClick={onShareQRCode}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Share QR Code
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
