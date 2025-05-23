import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const videoService = {
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axios.post(`${API_URL}/video/upload_image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // should include filename and thumbnail/image
  },
  async uploadVideo(file: File) {
    const formData = new FormData();
    formData.append('video', file);
    const response = await axios.post(`${API_URL}/video/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // should include filename and thumbnail/image
  },
  async processImage(filename: string) {
    const response = await axios.post(`${API_URL}/video/process_image/${filename}`);
    return response.data; // should include result image/thumbnail
  },
  async processVideo(filename: string) {
    const response = await axios.post(`${API_URL}/video/process/${filename}`);
    return response.data; // should include result image/thumbnail
  },
}; 