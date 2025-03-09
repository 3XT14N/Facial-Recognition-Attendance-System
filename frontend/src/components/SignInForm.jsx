import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../utils/api";
import Spinner from "./Spinner"; // Import the Spinner component

const SignInForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

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
      const credentials = { email, password, role };
      const response = await loginUser(credentials);

      if (response.error) {
        throw new Error(response.error);
      }

      localStorage.setItem("authToken", response.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: response.token,
          userId: response.id,
          userName: response.name,
          role: response.role,
          studentId: response.student_id || null,
          profId: response.prof_id || null,
        },
      });

      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      setGeneralError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Log In</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            disabled={loading}
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

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
            disabled={loading}
          />
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>

        {generalError && <p className="text-red-500 text-sm mt-2">{generalError}</p>}

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-white rounded-lg bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner size={20} color="#ffffff" /> {/* Use the Spinner component */}
                <span className="ml-2">Logging In...</span>
              </div>
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