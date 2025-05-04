import axios from 'axios';

// Replace with your machine's LAN IP when running on device/emulator
const api = axios.create({
  baseURL: 'http://192.168.1.48:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api; 