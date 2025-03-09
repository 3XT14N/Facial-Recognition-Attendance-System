import React, { useState } from "react";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Start with the login form

  const handleToggle = () => {
    setIsSignUp((prev) => !prev); // Ensures proper state toggling
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {isSignUp ? <SignUpForm /> : <SignInForm />}
        
        {/* Toggle Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={handleToggle}
            className="text-blue-600 font-medium hover:underline"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
