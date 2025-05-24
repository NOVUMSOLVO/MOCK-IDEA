import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    console.log('🔍 API: Sending login request to:', this.client.defaults.baseURL + '/api/auth/login');
    console.log('🔍 API: Login data:', { email, password: password.length + ' chars' });
    const response = await this.client.post('/api/auth/login', { email, password });
    console.log('🔍 API: Raw response:', response);
    return response.data;
  }

  async register(data: { email: string; password: string; firstName?: string; lastName?: string }) {
    const response = await this.client.post('/api/auth/register', data);
    return response.data;
  }

  async getProfile() {
    const response = await this.client.get('/api/auth/me');
    return response.data;
  }

  async updateProfile(data: { firstName?: string; lastName?: string }) {
    const response = await this.client.put('/api/auth/profile', data);
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await this.client.put('/api/auth/password', data);
    return response.data;
  }

  // Logo endpoints
  async uploadLogo(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await this.client.post('/api/logos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }

  async getLogos() {
    const response = await this.client.get('/api/logos');
    return response.data;
  }

  async getLogo(id: string) {
    const response = await this.client.get(`/api/logos/${id}`);
    return response.data;
  }

  async deleteLogo(id: string) {
    const response = await this.client.delete(`/api/logos/${id}`);
    return response.data;
  }

  async analyzeLogo(id: string) {
    const response = await this.client.post(`/api/logos/${id}/analyze`);
    return response.data;
  }

  // Template endpoints
  async getTemplates(params?: { category?: string; page?: number; limit?: number }) {
    const response = await this.client.get('/api/templates', { params });
    return response.data;
  }

  async getTemplate(id: string) {
    const response = await this.client.get(`/api/templates/${id}`);
    return response.data;
  }

  async getTemplateCategories() {
    const response = await this.client.get('/api/templates/categories');
    return response.data;
  }

  // Mockup endpoints
  async createMockup(data: {
    logoId: string;
    templateId: string;
    customizations?: any;
  }) {
    const response = await this.client.post('/api/mockups', data);
    return response.data;
  }

  async getMockups(params?: { page?: number; limit?: number }) {
    const response = await this.client.get('/api/mockups', { params });
    return response.data;
  }

  async getMockup(id: string) {
    const response = await this.client.get(`/api/mockups/${id}`);
    return response.data;
  }

  async deleteMockup(id: string) {
    const response = await this.client.delete(`/api/mockups/${id}`);
    return response.data;
  }

  // User endpoints
  async getUsage() {
    const response = await this.client.get('/api/users/usage');
    return response.data;
  }

  async getStats() {
    const response = await this.client.get('/api/users/stats');
    return response.data;
  }

  async getSubscription() {
    const response = await this.client.get('/api/users/subscription');
    return response.data;
  }

  // Payment endpoints
  async createCheckoutSession(priceId: string) {
    const response = await this.client.post('/api/payments/create-checkout-session', { priceId });
    return response.data;
  }

  async createPortalSession() {
    const response = await this.client.post('/api/payments/create-portal-session');
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Generic HTTP methods
  async get(url: string, config?: any) {
    return this.client.get(url, config);
  }

  async post(url: string, data?: any, config?: any) {
    return this.client.post(url, data, config);
  }

  async put(url: string, data?: any, config?: any) {
    return this.client.put(url, data, config);
  }

  async patch(url: string, data?: any, config?: any) {
    return this.client.patch(url, data, config);
  }

  async delete(url: string, config?: any) {
    return this.client.delete(url, config);
  }
}

export const api = new ApiClient();
export default api;
