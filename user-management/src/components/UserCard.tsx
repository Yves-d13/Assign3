import React from "react";

export default function UserCard({ user, onEdit, onDelete, darkMode }) {
  const initials = `${user.firstName[0]}${user.lastName[0] || ""}`.toUpperCase();

  const cardBg = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";

  return (
    <div className={`p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-colors duration-300 ${cardBg}`}>
      <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
        {initials}
      </div>
      <h2 className="text-lg font-semibold mb-1">
        {user.firstName} {user.lastName}
      </h2>
      <p className="text-sm">Email: {user.email}</p>
      <p className="text-sm">Status: {user.status.toLowerCase()}</p>
      <p className="text-sm mb-4">Date of Birth: {user.dob}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(user)}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user)}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
