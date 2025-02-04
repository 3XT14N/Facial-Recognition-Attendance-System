import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { registerUser } from "../utils/api"; // Import API call function

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");
  const [photo, setPhoto] = useState(null);
  const [photoSource, setPhotoSource] = useState("upload"); // 'upload' or 'scan'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    strand: "",
    professorId: "",
  });
  const [errors, setErrors] = useState({}); // Inline error handling

  const webcamRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
    // Clear errors when the user starts typing
    if (errors[id]) {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    
    if (role === "student") {
      if (!formData.studentId) newErrors.studentId = "Student ID is required.";
      if (!formData.strand) newErrors.strand = "Strand is required.";
    }
    
    if (role === "professor" && !formData.professorId) {
      newErrors.professorId = "Professor ID is required.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const userData = { ...formData, photo };
        const response = await registerUser(userData);
        setLoading(false);
        alert(response.message);
        console.log(userData);
        console.table(response);
      } catch (error) {
        setLoading(false);
        alert(error.message);
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">I am a</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="student">Student</option>
            <option value="professor">Professor</option>
          </select>
        </div>

        {/* Photo Source Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Photo Source</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="upload"
                checked={photoSource === "upload"}
                onChange={() => setPhotoSource("upload")}
                className="form-radio"
              />
              <span className="ml-2">Upload Photo</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="scan"
                checked={photoSource === "scan"}
                onChange={() => setPhotoSource("scan")}
                className="form-radio"
              />
              <span className="ml-2">Scan Photo</span>
            </label>
          </div>
        </div>

        {/* Profile Photo Upload or Scan */}
        <div className="space-y-2">
          {photoSource === "upload" ? (
            <>
              <label htmlFor="profile-photo" className="block text-sm font-medium text-gray-700">
                Upload Profile Photo
              </label>
              <input
                type="file"
                id="profile-photo"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </>
          ) : (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="mt-4 w-full h-auto rounded-lg"
              />
              <button
                type="button"
                onClick={capturePhoto}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Capture Photo
              </button>
            </>
          )}
          {photo && (
            <img
              src={photo}
              alt="Profile Preview"
              className="mt-4 w-32 h-32 rounded-full mx-auto"
            />
          )}
        </div>

        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-blue-500 focus:border-blue-500`}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-blue-500 focus:border-blue-500`}
              placeholder="example@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Credentials Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Credentials</h3>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:ring-blue-500 focus:border-blue-500`}
              placeholder="********"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } focus:ring-blue-500 focus:border-blue-500`}
              placeholder="********"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Role-Specific Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {role === "student" ? "Student Information" : "Professor Information"}
          </h3>
          {role === "student" ? (
            <>
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm ${
                    errors.studentId ? "border-red-500" : "border-gray-300"
                  } focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="123456"
                />
                {errors.studentId && (
                  <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
                )}
              </div>
              <div>
                <label htmlFor="strand" className="block text-sm font-medium text-gray-700">
                  Strand
                </label>
                <input
                  type="text"
                  id="strand"
                  value={formData.strand}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm ${
                    errors.strand ? "border-red-500" : "border-gray-300"
                  } focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Science & Technology"
                />
                {errors.strand && (
                  <p className="text-red-500 text-sm mt-1">{errors.strand}</p>
                )}
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="professorId" className="block text-sm font-medium text-gray-700">
                Professor ID
              </label>
              <input
                type="text"
                id="professorId"
                value={formData.professorId}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm ${
                  errors.professorId ? "border-red-500" : "border-gray-300"
                } focus:ring-blue-500 focus:border-blue-500`}
                placeholder="PROF123"
              />
              {errors.professorId && (
                <p className="text-red-500 text-sm mt-1">{errors.professorId}</p>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center py-2 px-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin h-5 w-5 mr-2 text-white"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                ></circle>
                <path
                  d="M4 12a8 8 0 018-8v8H4z"
                  fill="currentColor"
                  className="opacity-75"
                ></path>
              </svg>
              Signing Up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;