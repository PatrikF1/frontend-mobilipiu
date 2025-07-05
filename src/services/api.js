import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-mobilipiu.onrender.com/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    console.error('API URL:', API_BASE_URL)
    return Promise.reject(error)
  }
)

export const apiService = {
  // TEST API CONNECTION
  async testConnection() {
    console.log('🔗 Testing API connection to:', API_BASE_URL);
    try {
      const response = await api.get('/products');
      console.log('✅ API connection successful');
      return response.data;
    } catch (error) {
      console.error('❌ API connection failed:', error.response?.status, error.response?.statusText);
      console.error('📡 Full URL:', `${API_BASE_URL}/products`);
      throw error;
    }
  },

  // Products
  async getProducts(params = {}) {
    const response = await api.get('/products', { params })
    return response.data.data || response.data
  },

  async getProduct(id) {
    const response = await api.get(`/products/${id}`)
    return response.data.data || response.data
  },

  async addProduct(productData) {
    const response = await api.post('/admin/products', productData);
    return response.data.data || response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data.data || response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data.data || response.data;
  },

  // Product views tracking - REMOVED (backend doesn't have these routes)
  // async trackProductView(productId, viewData = {}) {
  //   try {
  //     const response = await api.post(`/products/${productId}/view`, {
  //       session_id: viewData.sessionId || this.getSessionId(),
  //       referrer: document.referrer,
  //       ...viewData
  //     });
  //     return response.data;
  //   } catch (error) {
  //     // Ne prekidaj rad ako tracking ne radi
  //     console.warn('Greška pri praćenju pregleda:', error);
  //     return null;
  //   }
  // },

  // async getViewsStats() {
  //   const response = await api.get('/products/stats/views');
  //   return response.data;
  // },

  // Helper method for session tracking - REMOVED
  // getSessionId() {
  //   let sessionId = localStorage.getItem('session_id');
  //   if (!sessionId) {
  //     sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  //     localStorage.setItem('session_id', sessionId);
  //   }
  //   return sessionId;
  // },

  // Categories
  async getCategories() {
    const response = await api.get('/categories')
    return response.data.data || response.data
  },

  // Brands
  async getBrands() {
    const response = await api.get('/brands')
    return response.data.data || response.data
  },

  // Subcategories
  async getSubcategories() {
    const response = await api.get('/subcategories')
    return response.data.data || response.data
  },

  // Contact
  async submitContactForm(formData) {
    const response = await api.post('/contact', formData)
    return response.data
  }
}

export default api 