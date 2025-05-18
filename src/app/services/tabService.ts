import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const tabService = {
  async getLicensePlates() {
    const response = await axios.get(`${API_URL}/license-plates`);
    return response.data.data;
  },
  async getEvents() {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  },
  async getVehicules() {
    const response = await axios.get(`${API_URL}/vehicles`);
    return response.data;
  },
  async getDrivers() {
    const response = await axios.get(`${API_URL}/drivers`);
    return response.data;
  },
  async getCameras() {
    const response = await axios.get(`${API_URL}/cameras`);
    return response.data;
  },
}; 