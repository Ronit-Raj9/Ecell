import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create API base URL from environment variable or use default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Define types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds (increased from 10)
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor - will be used to attach token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      
      // Handle authentication errors
      if (status === 401) {
        // Clear the token if present - user needs to login again
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          
          // Redirect to login page if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      } else if (status === 403) {
        console.error('Permission denied. You don\'t have access to this resource.');
      } else if (status === 429) {
        console.error('Too many requests. Please try again later.');
      } else if (status >= 500) {
        console.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error. Please check your connection and try again.', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API requests
export const apiRequest = async <T>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    
    return response.data;
  } catch (error: any) {
    // If the error has a response from the API
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || 'Something went wrong',
        data: error.response.data.data,
      };
    }
    
    // Network errors or other issues
    return {
      success: false,
      message: error.message || 'Network error',
    };
  }
};

// Create API service object with methods for each endpoint
const API = {
  // Auth endpoints
  auth: {
    signup: (userData: any) => apiRequest<{user: any; token: string}>('post', '/auth/signup', userData),
    login: (credentials: {email: string; password: string}) => 
      apiRequest<{user: any; token: string}>('post', '/auth/login', credentials),
    getProfile: () => apiRequest<{user: any}>('get', '/auth/me'),
  },
  
  // User endpoints
  user: {
    updateProfile: (userData: any) => apiRequest('patch', '/users/update-profile', userData),
    uploadProfilePicture: (formData: FormData) => 
      apiRequest<{profile_pic_url: string}>('patch', '/users/upload-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    deactivateAccount: () => apiRequest('patch', '/users/deactivate'),
    getAllUsers: () => apiRequest<{users: any[]}>('get', '/users/admin/users'),
    updateUserRole: (data: {userId: string; role: string}) => 
      apiRequest('patch', '/users/admin/update-role', data),
  },
  
  // Event endpoints
  events: {
    getAll: (params?: any) => apiRequest<{events: any[]}>('get', '/events', null, { params }),
    getById: (id: string) => apiRequest<{event: any}>('get', `/events/${id}`),
    create: (formData: FormData) => 
      apiRequest<{event: any}>('post', '/events/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    update: (id: string, formData: FormData) => 
      apiRequest<{event: any}>('patch', `/events/admin/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    delete: (id: string) => apiRequest('delete', `/events/admin/${id}`),
  },
  
  // Gallery endpoints
  gallery: {
    getAll: (params?: any) => apiRequest<{galleryItems: any[]}>('get', '/gallery', null, { params }),
    getAllAdmin: (params?: any) => apiRequest<{galleryItems: any[]}>('get', '/gallery/admin', null, { params }),
    upload: (formData: FormData) => 
      apiRequest<{galleryItem: any}>('post', '/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    approve: (id: string) => apiRequest<{galleryItem: any}>('patch', `/gallery/admin/${id}/approve`),
    delete: (id: string) => apiRequest('delete', `/gallery/${id}`),
    getOccasions: async (params?: { category?: string }) => {
      try {
        const url = params?.category 
          ? `/gallery/occasions?category=${params.category}`
          : `/gallery/occasions`;
          
        const { data } = await apiClient.get(url);
        return data;
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Could not fetch gallery occasions',
        };
      }
    },
    
    getAdminOccasions: async (params?: { category?: string }) => {
      try {
        const url = params?.category 
          ? `/gallery/admin/occasions?category=${params.category}`
          : `/gallery/admin/occasions`;
          
        const { data } = await apiClient.get(url);
        return data;
      } catch (error: any) {
        console.error('Error fetching admin occasions:', error);
        return {
          success: false,
          message: error.response?.data?.message || 'Could not fetch gallery occasions',
        };
      }
    },
    
    getOccasionById: async (id: string) => {
      try {
        const { data } = await apiClient.get(`/gallery/occasions/${id}`);
        return data;
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Could not fetch gallery occasion',
        };
      }
    },
    
    createOccasion: async (occasionData: {
      title: string;
      description: string;
      date: string;
      category: string;
      is_published?: boolean;
    }) => {
      try {
        const { data } = await apiClient.post(`/gallery/occasions`, occasionData);
        return data;
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Could not create gallery occasion',
        };
      }
    },
    
    updateOccasion: async (
      id: string,
      occasionData: {
        title?: string;
        description?: string;
        date?: string;
        category?: string;
        is_published?: boolean;
      }
    ) => {
      try {
        const { data } = await apiClient.patch(`/gallery/occasions/${id}`, occasionData);
        return data;
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Could not update gallery occasion',
        };
      }
    },
    
    deleteOccasion: async (id: string) => {
      try {
        const { data } = await apiClient.delete(`/gallery/occasions/${id}`);
        return data;
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Could not delete gallery occasion',
        };
      }
    },
    
    uploadPhoto: async (formData: FormData) => {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
  
      try {
        const response = await apiClient.post(`/gallery/photos`, formData, config);
        console.log('Photo upload response:', response.data);
        
        // If we get a response, count it as successful even if we don't have the expected structure
        if (response.data) {
          return {
            success: true,
            message: response.data.message || 'Photos uploaded successfully',
            data: response.data.data || response.data
          };
        }
        
        return response.data;
      } catch (error: any) {
        console.error('Error uploading photo:', error.response || error);
        return {
          success: false,
          message: error.response?.data?.message || 'Could not upload photo',
        };
      }
    },
    
    updatePhoto: async (
      id: string,
      photoData: {
        caption?: string;
        is_approved?: boolean;
      }
    ) => {
      try {
        const { data } = await apiClient.patch(`/gallery/photos/${id}`, photoData);
        return data;
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Could not update photo',
        };
      }
    },
    
    deletePhoto: async (id: string) => {
      try {
        const { data } = await apiClient.delete(`/gallery/photos/${id}`);
        return data;
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Could not delete photo',
        };
      }
    },
    
    getPendingApprovalPhotos: async () => {
      try {
        const { data } = await apiClient.get(`/gallery/photos/pending`);
        return data;
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Could not fetch pending photos',
        };
      }
    },
    
    setOccasionCover: async (occasionId: string, photoId: string) => {
      try {
        const { data } = await apiClient.patch(`/gallery/occasions/${occasionId}/cover`, { 
          photoId 
        });
        return data;
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Could not set cover image',
        };
      }
    },
  },
  
  // Resource endpoints
  resources: {
    getAll: (params?: any) => apiRequest<{resources: any[]}>('get', '/resources', null, { params }),
    getById: (id: string) => apiRequest<{resource: any}>('get', `/resources/${id}`),
    upload: (formData: FormData) => 
      apiRequest<{resource: any}>('post', '/resources/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    update: (id: string, data: any) => apiRequest<{resource: any}>('patch', `/resources/admin/${id}`, data),
    delete: (id: string) => apiRequest('delete', `/resources/admin/${id}`),
  },
  
  // Meeting endpoints
  meetings: {
    getAll: () => apiRequest<{meetings: any[]}>('get', '/meetings'),
    getById: (id: string) => apiRequest<{meeting: any}>('get', `/meetings/${id}`),
    create: (data: any) => apiRequest<{meeting: any}>('post', '/meetings/admin', data),
    update: (id: string, data: any) => apiRequest<{meeting: any}>('patch', `/meetings/admin/${id}`, data),
    delete: (id: string) => apiRequest('delete', `/meetings/admin/${id}`),
  },
  
  // Announcement endpoints
  announcements: {
    getAll: () => apiRequest<{announcements: any[]}>('get', '/announcements'),
    getById: (id: string) => apiRequest<{announcement: any}>('get', `/announcements/${id}`),
    create: (data: any) => apiRequest<{announcement: any}>('post', '/announcements/admin', data),
    update: (id: string, data: any) => apiRequest<{announcement: any}>('patch', `/announcements/admin/${id}`, data),
    delete: (id: string) => apiRequest('delete', `/announcements/admin/${id}`),
  },
  
  // Team member endpoints
  team: {
    getAll: (params?: any) => apiRequest<{core: any[]; members: any[]}>('get', '/team', null, { params }),
    create: (formData: FormData) => 
      apiRequest<{teamMember: any}>('post', '/team/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    update: (id: string, formData: FormData) => 
      apiRequest<{teamMember: any}>('patch', `/team/admin/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    delete: (id: string) => apiRequest('delete', `/team/admin/${id}`),
  },
  
  // Audit logs (superadmin only)
  auditLogs: {
    getAll: (params?: any) => apiRequest<{logs: any[]}>('get', '/admin/logs', null, { params }),
  },
};

// Event API endpoints
export const eventApi = {
  // Get all events with optional filtering
  getAllEvents: async (params?: {
    event_type?: string;
    category?: string;
    tag?: string;
    is_featured?: boolean;
    is_published?: boolean;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get('/events', { params });
    return response.data;
  },

  // Get event by ID
  getEventById: async (id: string) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  // Create a new event
  createEvent: async (eventData: FormData) => {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },

  // Update an existing event
  updateEvent: async (id: string, eventData: FormData) => {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete an event
  deleteEvent: async (id: string) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },

  // Manage winners for a past event
  manageWinners: async (id: string, data: FormData) => {
    const response = await apiClient.post(`/events/${id}/winners`, data);
    return response.data;
  },

  // Manage highlights for a past event
  manageHighlights: async (id: string, data: FormData) => {
    const response = await apiClient.post(`/events/${id}/highlights`, data);
    return response.data;
  },

  // Manage gallery images for a past event
  manageGallery: async (id: string, data: FormData) => {
    const response = await apiClient.post(`/events/${id}/gallery`, data);
    return response.data;
  },
  
  // Track form clicks
  trackFormClick: async (id: string) => {
    const response = await apiClient.post(`/events/${id}/track-form-click`);
    return response.data;
  },
  
  // Join an event (for logged-in users)
  joinEvent: async (id: string) => {
    const response = await apiClient.post(`/events/${id}/join`);
    return response.data;
  },
  
  // Get event analytics (admin only)
  getEventAnalytics: async (id: string) => {
    const response = await apiClient.get(`/events/${id}/analytics`);
    return response.data;
  }
};

// Gallery API endpoints
export const galleryApi = {
  // Get all gallery occasions
  getAllOccasions: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    sort?: string;
  }) => {
    const response = await apiClient.get('/gallery/occasions', { params });
    return response.data;
  },

  // Get gallery occasion by ID
  getOccasionById: async (id: string) => {
    const response = await apiClient.get(`/gallery/occasions/${id}`);
    return response.data;
  },

  // Get recent gallery items for homepage
  getRecentGalleryItems: async (limit: number = 8) => {
    const response = await apiClient.get('/gallery/recent', { params: { limit } });
    return response.data;
  },

  // Get photos by occasion ID
  getPhotosByOccasion: async (occasionId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get(`/gallery/occasions/${occasionId}/photos`, { params });
    return response.data;
  }
};

export default API; 