import axios from 'axios';
import './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Define an enum for user roles
export enum UserRole {
  USER = 0,
  ADMIN = 1,
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
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

// All endpoints require authentication. The token is added by the axios interceptor in auth.ts
class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_URL}/users/`);
      console.log(response)
      const usersRaw = Array.isArray(response.data.users) ? response.data.users : [];
      type BackendUser = { id: number; username: string; email: string; role: number; createdAt?: string };
      return usersRaw.map((u: BackendUser) => ({
        id: u.id,
        name: u.username,
        email: u.email,
        role: u.role === 1 ? 'Admin' : u.role === 2 ? 'User' : String(u.role),
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
        role: u.role === 1 ? 'Admin' : u.role === 2 ? 'User' : String(u.role),
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
        role?: UserRole;
        status?: string;
      } = {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      };
      if (data.status) payload.status = data.status;
      const response = await axios.post(`${API_URL}/users/`, payload);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      return null;
    }
  }

  async updateUser(userId: number, data: UpdateUserDto): Promise<User | null> {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, data);
      return response.data;
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
}

export const userService = new UserService(); 