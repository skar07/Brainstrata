import { promises as fs } from 'fs';
import path from 'path';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string; // Hashed password
  image?: string | null;
  createdAt: string;
  lastLogin?: string;
}

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

// Get the path to the users database file
const getUsersDbPath = () => {
  const dbDir = path.join(process.cwd(), 'temp');
  return path.join(dbDir, 'users.json');
};

// Ensure the temp directory exists
const ensureTempDir = async () => {
  const dbDir = path.join(process.cwd(), 'temp');
  try {
    await fs.mkdir(dbDir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
};

// Read users from file system
export async function getUsersDatabase(): Promise<StoredUser[]> {
  try {
    await ensureTempDir();
    const dbPath = getUsersDbPath();
    
    try {
      const data = await fs.readFile(dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is empty, return empty array
      return [];
    }
  } catch (error) {
    console.error('Error reading users database:', error);
    return [];
  }
}

// Save users to file system
export async function saveUsersDatabase(users: StoredUser[]): Promise<void> {
  try {
    await ensureTempDir();
    const dbPath = getUsersDbPath();
    await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users database:', error);
  }
}

// Register a new user (server-side)
export async function serverRegisterUser(
  email: string, 
  password: string, 
  name: string
): Promise<{ success: boolean; message: string; user?: StoredUser }> {
  try {
    const users = await getUsersDatabase();
    
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
    await saveUsersDatabase(users);

    return { success: true, message: 'User registered successfully', user: newUser };
  } catch (error) {
    console.error('Failed to register user:', error);
    return { success: false, message: 'Registration failed' };
  }
}

// Validate user credentials (server-side)
export async function serverValidateUser(
  email: string, 
  password: string
): Promise<{ success: boolean; message: string; user?: StoredUser }> {
  try {
    const users = await getUsersDatabase();
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
    await saveUsersDatabase(users);

    return { success: true, message: 'Login successful', user };
  } catch (error) {
    console.error('Failed to validate user:', error);
    return { success: false, message: 'Validation failed' };
  }
} 