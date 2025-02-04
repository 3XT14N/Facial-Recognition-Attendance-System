import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Register User (Form Data for Profile Photo)
export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    const response = await axios.post(`${API_URL}/signup`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Login User (JSON Data)
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
