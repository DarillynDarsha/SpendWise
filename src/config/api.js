// =====================================
// SPENDWISE - API BASE URL CONFIGURATION
// =====================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:8080'
    : 'https://spendwise-backend-atc9.onrender.com');

export default API_BASE_URL;