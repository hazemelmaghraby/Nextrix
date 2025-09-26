import React, { useState } from "react";
import { Bell } from "lucide-react";
import useNotifications from "../../constants/data/useNotifications";

const NotificationsPanel = () => {
  const [open, setOpen] = useState(false);
  const notifications = useNotifications();

  return (
    <div className="relative ml-4">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-white/10 transition"
      >
        <Bell className="w-6 h-6 text-gray-300" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-xl shadow-2xl bg-black/80 border border-white/10 backdrop-blur-lg z-[9999]">
          <div className="p-3 border-b border-white/10 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-200">Notifications</span>
            <span className="text-xs text-gray-400">
              {notifications.length} new
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="px-4 py-2 hover:bg-white/5 transition"
                >
                  <h2 className="text-md text-gray-200">{notif.title}</h2>
                  <p className="text-sm text-gray-200">{notif.message}</p>
                  <span className="text-xs text-gray-400">
                    {notif.createdAt?.toDate
                      ? new Date(notif.createdAt.toDate()).toLocaleString()
                      : "just now"}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-500">
                No notifications
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
