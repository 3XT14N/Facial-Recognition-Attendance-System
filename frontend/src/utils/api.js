import axios from "axios";

// Base URL for the API
const API_URL = "http://127.0.0.1:5000/api";

/**
 * Log in a user by sending their credentials to the backend.
 *
 * @param {Object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 * @param {string} credentials.role - The user's role (e.g., "student" or "professor").
 * @returns {Object} The response data from the backend.
 * @throws {Object} An error object with a message if the request fails.
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Return the response data if the request is successful
    return response.data;
  } catch (error) {
    // Handle errors and throw a user-friendly message
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.error || "Login failed. Please try again.");
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from the server. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an error
      throw new Error("An error occurred. Please try again.");
    }
  }
};