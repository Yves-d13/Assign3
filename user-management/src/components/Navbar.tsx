import { MoonIcon, SunIcon } from "@heroicons/react/outline";
import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  onCreateUser: () => void;
  onLogout: () => void;
  onToggleTheme: () => void;
  darkMode: boolean;
}

export default function Navbar({ onCreateUser, onLogout, onToggleTheme, darkMode }: NavbarProps) {
  return (
    <header className={`shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-blue-700 text-white"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-semibold">
          User Management
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateUser}
            className={`py-2 px-4 rounded-lg ${
              darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            Create User
          </button>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-blue-600"}`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}