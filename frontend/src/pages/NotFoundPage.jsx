// src/NotFound.jsx
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-red-600">404</h1>
        <p className="text-lg mt-4 text-gray-600">Sorry, the page you're looking for does not exist.</p>
        <a href="/" className="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Go Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
