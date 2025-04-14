import { MockMethod } from 'vite-plugin-mock';
import usersData from './users.json';

let users = usersData.users.map((user) => ({
  ...user,
  dob: user.dateOfBirth, // Map `dateOfBirth` to `dob`
  lastName: user.lastName || "Unknown", // Provide a default value for missing `lastName`
}));

const mock: MockMethod[] = [
  // GET: Fetch all users
  {
    url: '/api/users',
    method: 'get',
    timeout: 1000,
    response: () => {
      return {
        status: 200,
        users: users,
      };
    },
  },
];

export default mock;