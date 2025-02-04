import React, { useState } from "react";
import { loginUser } from "../utils/api";

const SignInForm = () => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(""); // Inline email error
  const [passwordError, setPasswordError] = useState(""); // Inline password error
  const [generalError, setGeneralError] = useState(""); // General error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    // Input validation
    if (!email) {
      setEmailError("Email is required.");
      setLoading(false);
      return;
    }

    if (!password) {
      setPasswordError("Password is required.");
      setLoading(false);
      return;
    }

    try {
      // Call login API with email, password, and role as credentials
      const credentials = { email, password, role };
      const data = await loginUser(credentials);

      // Save user data to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("role", role);

      // Redirect to dashboard
      setTimeout(() => {
        setLoading(false);
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      setLoading(false);
      setGeneralError(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Log In</h2>
      <form onSubmit={handleSubmit}>
        {/* Role Selection */}
        <div className="mb-4">
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

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              emailError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
            }`}
            placeholder="example@example.com"
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              passwordError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
            }`}
            placeholder="********"
          />
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>

        {/* General Error */}
        {generalError && <p className="text-red-500 text-sm mt-2">{generalError}</p>}

        {/* Submit Button */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center justify-center transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-spin h-5 w-5 mr-3 text-white"
                >
                  <circle
                    strokeWidth="4"
                    stroke="currentColor"
                    r="10"
                    cy="12"
                    cx="12"
                    className="opacity-25"
                  ></circle>
                  <path
                    d="M4 12a8 8 0 018-8v8H4z"
                    fill="currentColor"
                    className="opacity-75"
                  ></path>
                </svg>
                Logging In...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
