import React, { useState, useEffect } from "react";
import data from "../data/NotifData.json"; // Importing the JSON file

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(data.notifications);
  }, []);

  const handleNotificationClick = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-6">Notifications</h1>
      <div className="space-y-2">
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
    </div>
  );
};

export default NotificationsPage;
