import { MoonIcon, SunIcon } from "@heroicons/react/outline";

export default function Navbar({ onCreateUser, onLogout, onToggleTheme, darkMode }) {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">User Management</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateUser}
            className="bg-white text-blue-600 py-2 px-4 rounded-lg"
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
            className="text-white p-2 hover:bg-blue-600 rounded-full"
          >
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
  
  
  