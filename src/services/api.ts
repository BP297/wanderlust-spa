import axios from 'axios';
import { User, Hotel, Message, RegisterData, LoginData, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wanderlust_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 回應攔截器 - 處理錯誤
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('wanderlust_token');
      localStorage.removeItem('wanderlust_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 認證 API
export const authAPI = {
  register: async (userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (loginData: LoginData): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', loginData);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

// 飯店 API
export const hotelAPI = {
  getHotels: async (params?: {
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Hotel>>> => {
    const response = await api.get('/hotels', { params });
    return response.data;
  },

  getHotel: async (id: string): Promise<ApiResponse<Hotel>> => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },

  createHotel: async (hotelData: Partial<Hotel>): Promise<ApiResponse<Hotel>> => {
    const response = await api.post('/hotels', hotelData);
    return response.data;
  },

  updateHotel: async (id: string, hotelData: Partial<Hotel>): Promise<ApiResponse<Hotel>> => {
    const response = await api.put(`/hotels/${id}`, hotelData);
    return response.data;
  },

  deleteHotel: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  },

  toggleFavorite: async (hotelId: string): Promise<ApiResponse<User>> => {
    const response = await api.post(`/hotels/${hotelId}/favorite`);
    return response.data;
  },
};

// 訊息 API
export const messageAPI = {
  getMessages: async (params?: {
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Message>>> => {
    const response = await api.get('/messages', { params });
    return response.data;
  },

  getMessage: async (id: string): Promise<ApiResponse<Message>> => {
    const response = await api.get(`/messages/${id}`);
    return response.data;
  },

  sendMessage: async (messageData: {
    hotelId?: string;
    subject: string;
    content: string;
    type: 'inquiry' | 'reply';
    parentMessageId?: string;
  }): Promise<ApiResponse<Message>> => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  deleteMessage: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },
};

// 檔案上傳 API
export const uploadAPI = {
  uploadProfilePhoto: async (file: File): Promise<ApiResponse<{ profilePhoto: string }>> => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await api.post('/upload/profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api; 