const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private getAuthHeader() {
    const token = localStorage.getItem('wellness_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Session endpoints
  async getPublicSessions() {
    return this.request('/sessions');
  }

  async getMySessions() {
    return this.request('/my-sessions');
  }

  async getMySession(id: string) {
    return this.request(`/my-sessions/${id}`);
  }

  async saveDraft(sessionData: {
    id?: string;
    title: string;
    tags: string[];
    json_file_url: string;
  }) {
    return this.request('/my-sessions/save-draft', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async publishSession(sessionData: {
    id?: string;
    title: string;
    tags: string[];
    json_file_url: string;
  }) {
    return this.request('/my-sessions/publish', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async deleteSession(id: string) {
    return this.request(`/my-sessions/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface WellnessSession {
  _id: string;
  user_id: string | { email: string };
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}