'use client';

export interface UserData {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string; // Hashed password
  image?: string | null;
  createdAt: string;
  lastLogin?: string;
}

const USER_STORAGE_KEY = 'brainstrata_user';
const USERS_DB_KEY = 'brainstrata_users_db';

// Simple hash function (in production, use bcrypt or similar)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

// User session management (current user)
export function setUserToLocalStorage(user: UserData): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }
}

export function getUserFromLocalStorage(): UserData | null {
  try {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  } catch (error) {
    console.error('Failed to get user from localStorage:', error);
    return null;
  }
}

export function removeUserFromLocalStorage(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to remove user from localStorage:', error);
  }
}

export function updateUserInLocalStorage(updates: Partial<UserData>): void {
  try {
    const currentUser = getUserFromLocalStorage();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setUserToLocalStorage(updatedUser);
    }
  } catch (error) {
    console.error('Failed to update user in localStorage:', error);
  }
}

// Users database management (all registered users)
export function getUsersDatabase(): StoredUser[] {
  try {
    if (typeof window !== 'undefined') {
      const usersData = localStorage.getItem(USERS_DB_KEY);
      return usersData ? JSON.parse(usersData) : [];
    }
    return [];
  } catch (error) {
    console.error('Failed to get users database:', error);
    return [];
  }
}

export function saveUsersDatabase(users: StoredUser[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }
  } catch (error) {
    console.error('Failed to save users database:', error);
  }
}

export function registerUser(email: string, password: string, name: string): { success: boolean; message: string; user?: StoredUser } {
  try {
    const users = getUsersDatabase();
    
    // Check if user already exists
    if (users.find(user => user.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'User with this email already exists' };
    }

    // Create new user
    const newUser: StoredUser = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name,
      password: simpleHash(password),
      createdAt: new Date().toISOString(),
    };

    // Add to database
    users.push(newUser);
    saveUsersDatabase(users);

    return { success: true, message: 'User registered successfully', user: newUser };
  } catch (error) {
    console.error('Failed to register user:', error);
    return { success: false, message: 'Registration failed' };
  }
}

export function validateUser(email: string, password: string): { success: boolean; message: string; user?: StoredUser } {
  try {
    const users = getUsersDatabase();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const hashedPassword = simpleHash(password);
    if (user.password !== hashedPassword) {
      return { success: false, message: 'Invalid password' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    saveUsersDatabase(users);

    return { success: true, message: 'Login successful', user };
  } catch (error) {
    console.error('Failed to validate user:', error);
    return { success: false, message: 'Validation failed' };
  }
}

export function getAllUsers(): Omit<StoredUser, 'password'>[] {
  try {
    const users = getUsersDatabase();
    // Return users without passwords for security
    return users.map(({ password, ...user }) => user);
  } catch (error) {
    console.error('Failed to get all users:', error);
    return [];
  }
}

export function deleteUser(userId: string): boolean {
  try {
    const users = getUsersDatabase();
    const filteredUsers = users.filter(user => user.id !== userId);
    saveUsersDatabase(filteredUsers);
    return true;
  } catch (error) {
    console.error('Failed to delete user:', error);
    return false;
  }
}

export function updateUserPassword(email: string, oldPassword: string, newPassword: string): { success: boolean; message: string } {
  try {
    const users = getUsersDatabase();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const hashedOldPassword = simpleHash(oldPassword);
    if (user.password !== hashedOldPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    // Update password
    user.password = simpleHash(newPassword);
    saveUsersDatabase(users);

    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Failed to update password:', error);
    return { success: false, message: 'Password update failed' };
  }
}

// Clear all data (for development/testing)
export function clearAllData(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(USERS_DB_KEY);
    }
  } catch (error) {
    console.error('Failed to clear all data:', error);
  }
} 