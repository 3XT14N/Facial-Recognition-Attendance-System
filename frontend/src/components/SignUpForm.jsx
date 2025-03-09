import React, { useState } from "react";
import RoleSelection from "./signupComponents/RoleSelection";
import ProfilePhotoUpload from "./signupComponents/ProfilePhotoUpload";
import PersonalInfo from "./signupComponents/PersonalInfo";
import Credentials from "./signupComponents/Credentials";
import CaptureImageModal from "./modal/CaptureImageModal";
import { validateEmail, validatePassword } from "../utils/validation";

const SignUpForm = () => {
  const [role, setRole] = useState("student");
  const [photo, setPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    profId: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const openCamera = () => {
    setIsModalOpen(true);
    setErrors((prevErrors) => ({ ...prevErrors, photo: "" }));
  };

  const handleCapture = (image) => {
    setPhoto(image);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value.trim() }));
    if (errors[id]) setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (!validatePassword(formData.password)) newErrors.password = "Password must be at least 8 characters long";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!photo) newErrors.photo = "Profile photo is required";

    if (role === "student" && !formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    } else if (role === "professor" && !formData.profId.trim()) {
      newErrors.profId = "Professor ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    validateForm();
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
      studentId: role === "student" ? formData.studentId : undefined,
      profId: role === "professor" ? formData.profId : undefined,
      photo: photo,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        alert("Registration successful!");
      } else {
        setErrors({ api: data.error || "Something went wrong" });
      }
    } catch (error) {
      setErrors({ api: "Network error. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
      {success ? (
        <p className="text-green-500 text-center">Registration successful! Please check your email.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <RoleSelection role={role} setRole={setRole} />
          <ProfilePhotoUpload photo={photo} setPhoto={setPhoto} setErrors={setErrors} openCamera={openCamera} />
          {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
          <PersonalInfo formData={formData} handleChange={handleChange} errors={errors} />
          <Credentials formData={formData} handleChange={handleChange} errors={errors} />

          {role === "student" && (
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.studentId && <p className="text-red-500 text-sm">{errors.studentId}</p>}
            </div>
          )}
          {role === "professor" && (
            <div>
              <label htmlFor="profId" className="block text-sm font-medium text-gray-700">
                Professor ID
              </label>
              <input
                type="text"
                id="profId"
                value={formData.profId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.profId && <p className="text-red-500 text-sm">{errors.profId}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}
        </form>
      )}
      <CaptureImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCapture={handleCapture} />
    </div>
  );
};

export default SignUpForm;
