import React, { useState } from "react";

interface UserCardProps {
  user: any;
  onEdit: (updatedUser: any) => void;
  onDelete: (user: any) => void;
  darkMode: boolean;
}

export default function UserCard({ user, onEdit, onDelete, darkMode }: UserCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    onEdit(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div
      className={`p-6 rounded-lg shadow-md flex flex-col items-center text-center ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
        {initials || "NA"}
      </div>
      {isEditing ? (
        <div className="flex flex-col gap-2 w-full">
          <input
            type="text"
            name="firstName"
            value={editedUser.firstName || ""}
            onChange={handleChange}
            className={`p-2 border rounded ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={editedUser.lastName || ""}
            onChange={handleChange}
            className={`p-2 border rounded ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            placeholder="Last Name"
          />
          <input
            type="email"
            name="email"
            value={editedUser.email || ""}
            onChange={handleChange}
            className={`p-2 border rounded ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            placeholder="Email"
          />
          <input
            type="text"
            name="status"
            value={editedUser.status || ""}
            onChange={handleChange}
            className={`p-2 border rounded ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            placeholder="Status"
          />
          <input
            type="date"
            name="dob"
            value={editedUser.dob || ""}
            onChange={handleChange}
            className={`p-2 border rounded ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-1">
            {user.firstName || "Unknown"} {user.lastName || ""}
          </h2>
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-black"}`}>
            Email: {user.email || "No email provided"}
          </p>
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-black"}`}>
            Status: {user.status || "Unknown"}
          </p>
          <p className={`text-sm mb-4 ${darkMode ? "text-gray-300" : "text-black"}`}>
            Date of Birth: {user.dob || "Unknown"}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
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
        </>
      )}
    </div>
  );
}