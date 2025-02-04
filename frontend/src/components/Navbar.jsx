import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import data from "../data/NotifData.json"; // Importing the JSON file

const Navbar = ({ role, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setNotifications(data.notifications);
    setUserProfile(data.userProfile);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleNotificationMenu = () => setIsNotificationMenuOpen(!isNotificationMenuOpen);

  const handleSignOut = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("professorName");
    window.location.href = "/login";
  };

  // Mark a notification as read
  const handleNotificationClick = (id) => {
    // Mark the notification as read
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Calculate unread notifications count
  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo Section */}
        <Link
          to="/"
          className={`text-2xl font-bold transition-transform transform hover:scale-110 ${
            isActive("/") ? "underline decoration-blue-500" : ""
          }`}
        >
          Attendance System
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${
              isActive("/dashboard") ? "bg-blue-700" : "hover:bg-gray-700"
            }`}
          >
            Dashboard
          </Link>

          {role === "student" ? (
            <>
              <Link
                to="/attendance"
                className={`px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${
                  isActive("/attendance") ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
              >
                Attendance
              </Link>
              <Link
                to="/my-classes"
                className={`px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${
                  isActive("/my-classes") ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
              >
                Classes
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/attendance"
                className={`px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${
                  isActive("/attendance") ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
              >
                Attendance
              </Link>
              <Link
                to="/class-attendance"
                className={`px-4 py-2 rounded-lg transition-transform transform hover:scale-105 ${
                  isActive("/class-attendance") ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
              >
                Start Attendance
              </Link>
            </>
          )}

          {/* Notification Dropdown for Desktop */}
          <div className="relative">
            <button
              onClick={toggleNotificationMenu}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-transform transform hover:scale-105 relative"
            >
              <span className="text-lg">🔔</span>
              <span>Notifications</span>
              {/* Show unread count if there are any unread notifications */}
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {isNotificationMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 shadow-lg rounded-lg z-50">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-200 transition-colors ${
                        notification.read ? "text-gray-400" : "text-black"
                      }`}
                    >
                      {notification.message}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-400">No notifications</div>
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-transform transform hover:scale-105 hover:bg-gray-700"
            >
              <div className="w-10 h-10 bg-gray-500 rounded-full overflow-hidden">
                {userProfile.profilePicture ? (
                  <img
                    src={userProfile.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-full h-full text-gray-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" />
                  </svg>
                )}
              </div>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg z-50">
                <Link
                  to="/user-profile"
                  className="block px-4 py-2 hover:bg-gray-200 transition-colors"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4">
          <Link
            to="/dashboard"
            className={`px-4 py-2 w-full text-center ${
              isActive("/dashboard") ? "bg-blue-500" : "hover:bg-gray-700"
            }`}
          >
            Dashboard
          </Link>

          {role === "student" ? (
            <>
              <Link
                to="/attendance"
                className={`px-4 py-2 w-full text-center ${
                  isActive("/attendance") ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
              >
                Attendance
              </Link>
              <Link
                to="/my-classes"
                className={`px-4 py-2 w-full text-center ${
                  isActive("/my-classes") ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
              >
                My Classes
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/attendance"
                className={`px-4 py-2 w-full text-center ${
                  isActive("/attendance") ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
              >
                Mark Attendance
              </Link>
              <Link
                to="/class-attendance"
                className={`px-4 py-2 w-full text-center ${
                  isActive("/class-attendance") ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
              >
                Start Attendance
              </Link>
            </>
          )}

          {/* Notifications link in mobile menu */}
          <div className="flex flex-col space-y-2 mt-4">
            <Link
              to="/notifications"
              className="w-full text-left px-4 py-2 hover:bg-gray-700"
            >
              Notifications
            </Link>
            <button
              onClick={toggleProfileMenu}
              className="w-full text-left px-4 py-2 hover:bg-gray-700"
            >
              Profile
            </button>
            {isProfileMenuOpen && (
              <div className="flex flex-col space-y-2 mt-2">
                <Link
                  to="/user-profile"
                  className="block px-4 py-2 hover:bg-gray-200 transition-colors"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
