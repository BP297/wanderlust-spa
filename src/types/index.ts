export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'operator';
  profilePhoto?: string;
  favorites: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Hotel {
  _id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  sender: User;
  recipient: User;
  hotel?: Hotel;
  subject: string;
  content: string;
  type: 'inquiry' | 'reply' | 'notification';
  parentMessageId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'operator';
  signupCode?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} 