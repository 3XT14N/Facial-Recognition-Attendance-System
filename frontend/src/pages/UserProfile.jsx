import React, { useState, useEffect } from "react";

const UserProfile = () => {
  // Access the logged-in user data from localStorage
  const userDataFromLocalStorage = JSON.parse(localStorage.getItem("userData"));

  const [name, setName] = useState(userDataFromLocalStorage?.name || "John Doe");
  const [email, setEmail] = useState(userDataFromLocalStorage?.email || "student@example.com");
  const [password, setPassword] = useState(userDataFromLocalStorage?.password || "123");
  const [profilePicture, setProfilePicture] = useState(
    "https://www.w3schools.com/w3images/avatar2.png"
  ); // Default profile picture

  useEffect(() => {
    // If userDataFromLocalStorage exists, update the state with that data
    if (userDataFromLocalStorage) {
      setName(userDataFromLocalStorage.name);
      setEmail(userDataFromLocalStorage.email);
      setPassword(userDataFromLocalStorage.password);
    }
  }, [userDataFromLocalStorage]);

  const handleSaveChanges = () => {
    // Here, you would save the updated data back to localStorage (or a server in a real app)
    const updatedUserData = {
      ...userDataFromLocalStorage,
      name,
      email,
      password,
    };
    localStorage.setItem("userData", JSON.stringify(updatedUserData));

    alert("Changes saved successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="text-center">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-300"
          />
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-gray-500">{email}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
          <form>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSaveChanges}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
