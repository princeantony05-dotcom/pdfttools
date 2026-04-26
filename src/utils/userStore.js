const USERS_LIST_KEY = 'pdf_elite_registered_users';
const LOGGED_IN_USER_KEY = 'pdf_elite_user_data';

const initialUsers = [
  { 
    email: 'admin@pdfelite.app', 
    password: 'admin123', 
    name: 'Admin Elite', 
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  },
  { 
    email: 'user@pdfelite.app', 
    password: 'user123', 
    name: 'John Doe', 
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  }
];

const defaultUserDataTemplate = (profile) => ({
  profile: {
    ...profile,
    joined: new Date().toISOString().split('T')[0]
  },
  subscription: {
    plan: 'Basic (Free)',
    status: 'Active',
    expiryDate: '2026-12-31',
    price: '$0.00',
    autoRenew: false
  },
  purchases: [],
  supportTickets: []
});

export const getRegisteredUsers = () => {
  const stored = localStorage.getItem(USERS_LIST_KEY);
  if (!stored) {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(stored);
};

export const checkEmailExists = (email) => {
  const users = getRegisteredUsers();
  return users.some(u => u.email.toLowerCase() === email.toLowerCase());
};

export const registerUser = (name, email, password) => {
  if (checkEmailExists(email)) return { success: false, message: 'Email already in use' };
  
  const users = getRegisteredUsers();
  const newUser = { 
    name, 
    email: email.toLowerCase(), 
    password, 
    role: 'user',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
  };
  
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify([...users, newUser]));
  
  // Set as currently logged in user data
  const userData = defaultUserDataTemplate(newUser);
  localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(userData));
  
  return { success: true, user: newUser };
};

export const authenticateUser = (email, password) => {
  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (user) {
    // Check if we have detailed data for this user, if not create from template
    let userData = localStorage.getItem(LOGGED_IN_USER_KEY);
    if (userData) {
      userData = JSON.parse(userData);
      if (userData.profile.email !== user.email) {
        userData = defaultUserDataTemplate(user);
        localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(userData));
      }
    } else {
      userData = defaultUserDataTemplate(user);
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(userData));
    }
    return { success: true, user };
  }
  return { success: false, message: 'Invalid email or password' };
};

export const changePassword = (email, newPassword) => {
  const users = getRegisteredUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    return { success: true };
  }
  return { success: false, message: 'User not found' };
};

export const getUserData = () => {
  const stored = localStorage.getItem(LOGGED_IN_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const updateProfile = (profile) => {
  const data = getUserData();
  if (!data) return null;
  const newData = { ...data, profile: { ...data.profile, ...profile } };
  localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(newData));
  
  // Also update in registered users list
  const users = getRegisteredUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === data.profile.email.toLowerCase());
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...profile };
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  }
  
  return newData;
};

export const addSupportTicket = (ticket) => {
  const data = getUserData();
  if (!data) return null;
  const newTicket = {
    id: `#TKT-${Math.floor(Math.random() * 1000)}`,
    ...ticket,
    status: 'Open',
    date: new Date().toISOString().split('T')[0]
  };
  const newData = { ...data, supportTickets: [newTicket, ...data.supportTickets] };
  localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(newData));
  return newData;
};
