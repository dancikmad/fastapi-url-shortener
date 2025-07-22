import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface URLBase {
  target_url: string;
}

export interface URLInfo {
  target_url: string;
  is_active: boolean;
  clicks: number;
  url: string;
  admin_url: string;
}

export interface User {
  email: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export const urlService = {
  createShortURL: async (targetUrl: string): Promise<URLInfo> => {
    const response = await api.post<URLInfo>('/url', { target_url: targetUrl });
    return response.data;
  },

  getURLInfo: async (secretKey: string): Promise<URLInfo> => {
    const response = await api.get<URLInfo>(`/admin/${secretKey}`);
    return response.data;
  },

  deleteURL: async (secretKey: string): Promise<{ detail: string }> => {
    const response = await api.delete<{ detail: string }>(`/admin/${secretKey}`);
    return response.data;
  },
};

export const authService = {
  login: async (email: string, password: string): Promise<AuthToken> => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post<AuthToken>('/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    localStorage.setItem('token', response.data.access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  register: async (email: string, password: string): Promise<User> => {
    const response = await api.post<User>('/register', { email, password });
    return response.data;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

const token = authService.getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}