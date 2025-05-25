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
  async updateVehicle(vehicleId: number, data: { make?: string; color?: string; model?: string }) {
    const response = await axios.put(`${API_URL}/vehicles/${vehicleId}`, data);
    return response.data;
  },
  async deleteVehicle(vehicleId: number) {
    const response = await axios.delete(`${API_URL}/vehicles/${vehicleId}`);
    return response.data;
  },
  async updateLicensePlate(plateId: number, data: { plateNumber: string }) {
    const response = await axios.put(`${API_URL}/license-plates/${plateId}`, data);
    return response.data;
  },
  async deleteLicensePlate(plateId: number) {
    const response = await axios.delete(`${API_URL}/license-plates/${plateId}`);
    return response.data;
  },
  async getNotifications() {
    const response = await axios.get(`${API_URL}/notification/`);
    return response.data;
  },
  async markNotificationAsRead(notificationId: number) {
    const response = await axios.post(`${API_URL}/notification/${notificationId}/read`);
    return response.data;
  },
  async getAlerts() {
    const response = await axios.get(`${API_URL}/alert/`);
    return response.data;
  },
  async acknowledgeAlert(alertId: number) {
    const response = await axios.post(`${API_URL}/alert/${alertId}/acknowledge`);
    return response.data;
  },
}; 