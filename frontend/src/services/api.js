import axios from 'axios';

// Use 127.0.0.1 to avoid IPv6 delay on Windows (localhost tries IPv6 first)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const productApi = {
  getDepartments: () => api.get('/departments'),
  getProducts: (deptId) => api.get('/products', { params: { department_id: deptId } }),
  getProduct: (id) => api.get(`/products/${id}`),
};

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { product_id: productId, quantity }),
  updateQuantity: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export const orderApi = {
  checkout: () => api.post('/orders/checkout'),
  getHistory: () => api.get('/orders'),
  getOrderDetails: (code) => api.get(`/orders/${code}`),
};

export default api;
