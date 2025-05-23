import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const tabService = {
  async getLicensePlates(page = 1, limit = 10) {
    const response = await axios.get(`${API_URL}/license-plates`, { params: { page, limit } });
    return response.data;
  },
  async getEvents(page = 1, limit = 10) {
    const response = await axios.get(`${API_URL}/events`, { params: { page, limit } });
    return response.data;
  },
  async getVehicules(page = 1, limit = 10) {
    const response = await axios.get(`${API_URL}/vehicles`, { params: { page, limit } });
    return response.data;
  },
  async getDrivers() {
    const response = await axios.get(`${API_URL}/drivers`);
    return response.data.data;
  },
  async getCameras() {
    const response = await axios.get(`${API_URL}/cameras`);
    return response.data.data;
  },
}; 