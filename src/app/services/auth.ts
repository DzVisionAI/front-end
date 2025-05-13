import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

class AuthService {
  private setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;samesite=strict${process.env.NODE_ENV === 'production' ? ';secure' : ''}`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    if (response.data.token) {
      // Set token cookie
      this.setCookie('token', response.data.token, 7); // 7 days
      // Set role cookie based on returned role number
      let roleValue = 'user';
      if (response.data.user.role === 1 || response.data.user.role === '1') {
        roleValue = 'admin';
      }
      this.setCookie('role', roleValue, 7); // 7 days
      // Store user data in memory
      this.setUser(response.data.user);
    }
    return response.data;
  }

  logout(): void {
    this.deleteCookie('token');
    this.setUser(null);
    window.location.href = '/';
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getCookie('token');
      console.log('token', token);
      if (!token) return null;

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.setUser(response.data);
      return response.data;
    } catch {
      this.logout();
      return null;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await axios.post(`${API_URL}/auth/forgot-password`, { email });
  }

  async validateResetToken(token: string): Promise<boolean> {
    try {
      await axios.post(`${API_URL}/auth/validate-reset-token`, { token });
      return true;
    } catch {
      return false;
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      new_password: password,
    });
  }

  getToken(): string | null {
    return this.getCookie('token');
  }

  private user: User | null = null;

  private setUser(user: User | null): void {
    this.user = user;
  }

  getUser(): User | null {
    return this.user;
  }
}

export const authService = new AuthService();

// Axios interceptor to add JWT token to requests
axios.interceptors.request.use(
  (config) => {
    const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
); 