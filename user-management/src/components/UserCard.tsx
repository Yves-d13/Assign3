// components/UserCard.tsx
import React from 'react';
import { User } from '../types'; // Create this type if you haven't

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  darkMode: boolean;
}

export default function UserCard({ user, onEdit, onDelete, darkMode }: UserCardProps) {
  // Add null checks and safe defaults
  const safeUser = {
    firstName: user?.firstName || 'Unknown',
    lastName: user?.lastName || '',
    email: user?.email || 'No email',
    status: user?.status || 'Unknown',
    dob: user?.dob || new Date().toISOString(),
  };

  // Safe initials calculation
  const initials = `${safeUser.firstName[0]}${safeUser.lastName?.[0] || ''}`.toUpperCase();

  // Status color mapping
  const statusColors = {
    ACTIVE: 'text-green-500',
    LOCKED: 'text-red-500',
    UNKNOWN: 'text-gray-500',
  };

  return (
    <div className={`p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
        {initials}
      </div>
      
      <h2 className="text-lg font-semibold mb-1">
        {safeUser.firstName} {safeUser.lastName}
      </h2>
      
      <p className="text-sm">Email: {safeUser.email}</p>
      
      <p className={`text-sm ${
        statusColors[safeUser.status as keyof typeof statusColors] || statusColors.UNKNOWN
      }`}>
        Status: {safeUser.status}
      </p>
      
      <p className="text-sm mb-4">
        Date of Birth: {new Date(safeUser.dob).toLocaleDateString()}
      </p>
      
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