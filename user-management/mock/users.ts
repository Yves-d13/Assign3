import { MockMethod } from 'vite-plugin-mock';
import usersData from './users.json';

let users = usersData.users.map((user) => ({
  ...user,
  dob: user.dateOfBirth, // Map `dateOfBirth` to `dob`
  lastName: user.lastName || "Unknown", // Provide a default value for missing `lastName`
}));

const mock: MockMethod[] = [
  // GET: Fetch all users or filter by search query
  {
    url: '/api/users',
    method: 'get',
    timeout: 1000,
    response: ({ query }) => {
      const search = query.search?.toLowerCase() || "";
      const filteredUsers = users.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(search) ||
          user.lastName?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search)
      );
      return {
        status: 200,
        users: filteredUsers,
      };
    },
  },
];

export default mock;