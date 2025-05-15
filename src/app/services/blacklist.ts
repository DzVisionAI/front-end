import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getTokenFromCookie() {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export interface BlacklistUser {
  id: number;
  username: string;
}

export interface BlacklistEntry {
  id: number;
  plateNumber: string;
  addedBy: BlacklistUser;
  createAt: string;
  reason?: string;
  status: string;
}

export interface CreateBlacklistDto {
  plateNumber: string;
  reason?: string;
  status?: string;
}

export interface UpdateBlacklistDto {
  plateNumber?: string;
  reason?: string;
  status?: string;
}

class BlacklistService {
  async getBlacklists(): Promise<BlacklistEntry[]> {
    try {
      const token = getTokenFromCookie();
      const response = await axios.get(`${API_URL}/blacklist/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const list = Array.isArray(response.data.data) ? response.data.data : [];
      return list.map((entry: any) => ({
        id: entry.id,
        plateNumber: entry.plateNumber,
        addedBy: entry.addedBy,
        createAt: entry.createAt,
        reason: entry.reason,
        status: entry.status ? (typeof entry.status === 'string' ? entry.status.charAt(0).toUpperCase() + entry.status.slice(1) : 'Active') : 'Active',
      }));
    } catch (error) {
      console.error('Failed to fetch blacklists:', error);
      return [];
    }
  }

  async getBlacklist(id: number): Promise<BlacklistEntry | null> {
    try {
      const token = getTokenFromCookie();
      const response = await axios.get(`${API_URL}/blacklist/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const entry = response.data.blacklist || response.data;
      return {
        id: entry.id,
        plateNumber: entry.plateNumber,
        addedBy: entry.addedBy,
        createAt: entry.createAt,
        reason: entry.reason,
        status: entry.status || 'Active',
      };
    } catch (error) {
      console.error('Failed to fetch blacklist entry:', error);
      return null;
    }
  }

  async createBlacklist(data: CreateBlacklistDto): Promise<BlacklistEntry | null> {
    try {
      const token = getTokenFromCookie();
      const response = await axios.post(`${API_URL}/blacklist/`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const entry = response.data.data || response.data.blacklist || response.data;
      return {
        id: entry.id,
        plateNumber: entry.plateNumber,
        addedBy: entry.addedBy,
        createAt: entry.createAt,
        reason: entry.reason,
        status: entry.status ? (typeof entry.status === 'string' ? entry.status.charAt(0).toUpperCase() + entry.status.slice(1) : 'Active') : 'Active',
      };
    } catch (error) {
      console.error('Failed to create blacklist entry:', error);
      return null;
    }
  }

  async updateBlacklist(id: number, data: UpdateBlacklistDto): Promise<BlacklistEntry | null> {
    try {
      const token = getTokenFromCookie();
      const response = await axios.put(`${API_URL}/blacklist/${id}`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const entry = response.data.blacklist || response.data;
      return {
        id: entry.id,
        plateNumber: entry.plateNumber,
        addedBy: entry.addedBy,
        createAt: entry.createAt,
        reason: entry.reason,
        status: entry.status || 'Active',
      };
    } catch (error) {
      console.error('Failed to update blacklist entry:', error);
      return null;
    }
  }

  async deleteBlacklist(id: number): Promise<boolean> {
    try {
      const token = getTokenFromCookie();
      await axios.delete(`${API_URL}/blacklist/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return true;
    } catch (error) {
      console.error('Failed to delete blacklist entry:', error);
      return false;
    }
  }
}

export const blacklistService = new BlacklistService(); 