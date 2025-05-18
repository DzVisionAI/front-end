import axios from 'axios';
import './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Define an enum for user roles
export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: string;
}

// Add a type guard for axios error
function isAxiosErrorWithMessage(error: unknown): error is { response: { data: { message: string } } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object' &&
    (error as { response?: unknown }).response !== null &&
    'data' in (error as { response?: { data?: unknown } }).response &&
    typeof (error as { response: { data?: unknown } }).response.data === 'object' &&
    (error as { response: { data?: unknown } }).response.data !== null &&
    'message' in (error as { response: { data: { message?: unknown } } }).response.data
  );
}

// All endpoints require authentication. The token is added by the axios interceptor in auth.ts
class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_URL}/users/`);
      const usersRaw = Array.isArray(response.data.users) ? response.data.users : [];
      type BackendUser = { id: number; username: string; email: string; role: string; createdAt?: string };
      return usersRaw.map((u: BackendUser) => ({
        id: u.id,
        name: u.username,
        email: u.email,
        role: u.role.toLowerCase() as UserRole,
        status: 'Active', // You can adjust this if your API provides status
      }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }

  async getUser(userId: number): Promise<User | null> {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      const u = response.data;
      if (!u) return null;
      return {
        id: u.id,
        name: u.username,
        email: u.email,
        role: u.role.toLowerCase() as UserRole,
        status: 'Active', // Adjust if your API provides status
      };
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  }

  async createUser(data: CreateUserDto): Promise<User | null> {
    try {
      // Only send required fields for backend
      const payload: {
        username: string;
        email: string;
        password: string;
        role?: string;
        status?: string;
      } = {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      };
      if (data.status) payload.status = data.status;
      const response = await axios.post(`${API_URL}/users/`, payload);
      const u = response.data.user;
      if (!u) return null;
      return {
        id: u.id,
        name: u.username,
        email: u.email,
        role: u.role ? u.role.toLowerCase() as UserRole : 'user',
        status: u.status || 'Active',
      };
    } catch (error) {
      console.error('Failed to create user:', error);
      return null;
    }
  }

  async updateUser(userId: number, data: UpdateUserDto): Promise<User | null> {
    try {
      const payload = { ...data };
      if (payload.role) payload.role = payload.role;
      const response = await axios.put(`${API_URL}/users/${userId}`, payload);
      const u = response.data.user;
      if (!u) return null;
      return {
        id: u.id,
        name: u.username,
        email: u.email,
        role: u.role ? u.role.toLowerCase() as UserRole : 'user',
        status: u.status || 'Active',
      };
    } catch (error) {
      console.error('Failed to update user:', error);
      return null;
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false;
    }
  }

  // Update current user's profile (email, username)
  async updateMyProfile(data: { email?: string; username?: string }): Promise<User | null> {
    try {
      const response = await axios.put(`${API_URL}/user/me/profile`, data);
      const u = response.data.user;
      if (!u) return null;
      return {
        id: u.id,
        name: u.username,
        email: u.email,
        role: u.role ? u.role.toLowerCase() as UserRole : 'user',
        status: u.status || 'Active',
      };
    } catch (error) {
      console.error('Failed to update profile:', error);
      return null;
    }
  }

  // Reset current user's password
  async resetMyPassword(data: { oldPassword: string; newPassword: string }): Promise<boolean | { message: string }> {
    try {
      const response = await axios.post(`${API_URL}/users/me/reset-password`, {
        old_password: data.oldPassword,
        new_password: data.newPassword,
      });
      if (response.data && response.data.success === false && response.data.message) {
        return { message: response.data.message };
      }
      return true;
    } catch (error: unknown) {
      if (isAxiosErrorWithMessage(error)) {
        return { message: error.response.data.message };
      }
      console.error('Failed to reset password:', error);
      return false;
    }
  }
}

export const userService = new UserService(); 