import { useState } from "react";
import Navbar from "./components/Navbar";
import UserCard from "./components/UserCard";
import './index.css';

const dummyUsers = [
  { firstName: "John", lastName: "Doe", email: "john.doe@example.com", status: "Active", dob: "1990-05-15" },
  { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", status: "Locked", dob: "1988-10-22" },
  { firstName: "Alice", lastName: "Johnson", email: "alice.johnson@example.com", status: "Active", dob: "1995-02-10" },
  { firstName: "Bob", lastName: "Martin", email: "bob.martin@example.com", status: "Locked", dob: "1980-08-05" },
  { firstName: "Charlie", lastName: "Brown", email: "charlie.brown@example.com", status: "Active", dob: "1992-11-30" },
  { firstName: "David", lastName: "Lee", email: "david.lee@example.com", status: "Locked", dob: "1987-07-14" },
  { firstName: "Eve", lastName: "Green", email: "eve.green@example.com", status: "Active", dob: "1993-09-21" },
  { firstName: "Frank", lastName: "White", email: "frank.white@example.com", status: "Active", dob: "1994-01-25" },
  { firstName: "Grace", lastName: "Black", email: "grace.black@example.com", status: "Locked", dob: "1985-03-17" },
  { firstName: "Hannah", lastName: "", email: "hannah.purple@example.com", status: "Active", dob: "1996-12-03" },
];

function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(dummyUsers);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleCreateUser = () => {
    const newUser = {
      firstName: "New",
      lastName: "User",
      email: `new.user${users.length + 1}@example.com`,
      status: "Active",
      dob: "2000-01-01",
    };
    setUsers([...users, newUser]);
  };

  const handleLogout = () => console.log("Logout clicked");
  const toggleTheme = () => setDarkMode(!darkMode);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user) => {
    setUsers(users.filter((u) => u !== user));
  };

  const handleSave = () => {
    setUsers(users.map((u) => (u.email === currentUser.email ? currentUser : u)));
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white">
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
              />
            ))}
          </div>
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;