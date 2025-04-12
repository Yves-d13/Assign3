import { useState } from "react"; 
import Navbar from "./components/Navbar";
import UserCard from "./components/UserCard";
import './index.css';

const dummyUsers = [
  { firstName: "Yves", lastName: "Al Debs", email: "debsyves@gmail.com", status: "Active", dob: "2003-05-05" },
  { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", status: "Locked", dob: "1988-10-22" },
  { firstName: "Alice", lastName: "Johnson", email: "alice.johnson@example.com", status: "Active", dob: "1995-02-10" },
  { firstName: "Bob", lastName: "Martin", email: "bob.martin@example.com", status: "Locked", dob: "1980-08-05" },
  { firstName: "Charlie", lastName: "Brown", email: "charlie.brown@example.com", status: "Active", dob: "1992-11-30" },
];

function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(dummyUsers);
  const [darkMode, setDarkMode] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "Active",
    dob: "",
  });

  const handleCreateUser = () => {
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      status: "Active",
      dob: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveNewUser = () => {
    setUsers([...users, newUser]);
    setIsCreateModalOpen(false);
  };

  const handleLogout = () => console.log("Logout clicked");
  const toggleTheme = () => setDarkMode(!darkMode);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user) => {
    setUsers(users.filter((u) => u !== user));
  };

  const handleSaveEdit = () => {
    setUsers(users.map((u) => (u.email === currentUser.email ? currentUser : u)));
    setIsEditModalOpen(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <Navbar
        onCreateUser={handleCreateUser}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        darkMode={darkMode}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-3 mb-8 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredUsers.map((user, index) => (
            <UserCard
              key={index}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              darkMode={darkMode}  
            />
          ))}
        </div>
      </main>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Create User</h2>
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <select
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded"
              value={newUser.status}
              onChange={(e) =>
                setNewUser({ ...newUser, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Locked">Locked</option>
            </select>
            <input
              type="date"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded"
              value={newUser.dob}
              onChange={(e) =>
                setNewUser({ ...newUser, dob: e.target.value })
              }
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveNewUser}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded"
              value={currentUser.firstName}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, firstName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded"
              value={currentUser.lastName}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, lastName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded"
              value={currentUser.email}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, email: e.target.value })
              }
            />
            <select
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded"
              value={currentUser.status}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Locked">Locked</option>
            </select>
            <input
              type="date"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded"
              value={currentUser.dob}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, dob: e.target.value })
              }
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
