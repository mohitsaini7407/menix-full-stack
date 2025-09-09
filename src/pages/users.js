// Example users (passwords are in plain text for demo purposes only)

const DEFAULT_PROFILE_PIC = 'https://ui-avatars.com/api/?name=User&background=random';

const users = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    phone: "9876543210",
    password: "password123",
    profilePic: "https://ui-avatars.com/api/?name=John+Doe&background=random"
  },
  {
    id: 2,
    username: "jane_smith",
    email: "jane@example.com",
    phone: "9123456789",
    password: "securepass",
    profilePic: "" // No profile pic, will use default
  }
  // Add more users as needed
];

export const defaultUserPic = DEFAULT_PROFILE_PIC;

// Function to check login credentials
export function authenticateUser(usernameOrEmail, password) {
  const input = typeof usernameOrEmail === 'string' ? usernameOrEmail.toLowerCase() : '';
  return users.find(
    user =>
      ((user.username && user.username.toLowerCase() === input) ||
       (user.email && user.email.toLowerCase() === input)) &&
      user.password === password
  );
}

export default users; 