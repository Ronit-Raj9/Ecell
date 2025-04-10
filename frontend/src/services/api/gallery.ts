import API from './config';
import { AxiosRequestConfig } from 'axios';

const GALLERY_URL = '/api/gallery';

export default {
  /**
   * Get all published gallery occasions with optional category filter
   */
  getOccasions: async (params?: { category?: string }) => {
    try {
      const url = params?.category 
        ? `${GALLERY_URL}/occasions?category=${params.category}`
        : `${GALLERY_URL}/occasions`;
        
      const { data } = await API.get(url);
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not fetch gallery occasions',
      };
    }
  },

  /**
   * Get a single gallery occasion by ID, including its photos
   */
  getOccasionById: async (id: string) => {
    try {
      const { data } = await API.get(`${GALLERY_URL}/occasions/${id}`);
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not fetch gallery occasion',
      };
    }
  },

  /**
   * Create a new gallery occasion
   */
  createOccasion: async (occasionData: {
    title: string;
    description: string;
    date: string;
    category: string;
    is_published?: boolean;
  }) => {
    try {
      const { data } = await API.post(`${GALLERY_URL}/occasions`, occasionData);
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not create gallery occasion',
      };
    }
  },

  /**
   * Update an existing gallery occasion
   */
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
      const { data } = await API.patch(`${GALLERY_URL}/occasions/${id}`, occasionData);
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not update gallery occasion',
      };
    }
  },

  /**
   * Delete a gallery occasion and all its photos
   */
  deleteOccasion: async (id: string) => {
    try {
      const { data } = await API.delete(`${GALLERY_URL}/occasions/${id}`);
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not delete gallery occasion',
      };
    }
  },

  /**
   * Upload a photo to a gallery occasion
   */
  uploadPhoto: async (formData: FormData) => {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const { data } = await API.post(`${GALLERY_URL}/photos`, formData, config);
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not upload photo',
      };
    }
  },

  /**
   * Update a gallery photo (e.g., change caption or approve)
   */
  updatePhoto: async (
    id: string,
    photoData: {
      caption?: string;
      is_approved?: boolean;
    }
  ) => {
    try {
      const { data } = await API.patch(`${GALLERY_URL}/photos/${id}`, photoData);
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not update photo',
      };
    }
  },

  /**
   * Delete a gallery photo
   */
  deletePhoto: async (id: string) => {
    try {
      const { data } = await API.delete(`${GALLERY_URL}/photos/${id}`);
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not delete photo',
      };
    }
  },

  /**
   * Get all photos pending approval (admin only)
   */
  getPendingApprovalPhotos: async () => {
    try {
      const { data } = await API.get(`${GALLERY_URL}/photos/pending`);
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not fetch pending photos',
      };
    }
  },

  /**
   * Set a photo as the cover image for an occasion
   */
  setOccasionCover: async (occasionId: string, photoId: string) => {
    try {
      const { data } = await API.patch(`${GALLERY_URL}/occasions/${occasionId}/cover`, { 
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

  /**
   * Like a photo
   */
  likePhoto: async (photoId: string) => {
    try {
      const { data } = await API.post(`${GALLERY_URL}/photos/${photoId}/like`);
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not like photo',
      };
    }
  },

  /**
   * Get all gallery occasions (admin view) - includes unpublished occasions
   */
  getAdminOccasions: async (params?: { category?: string }) => {
    try {
      const url = params?.category 
        ? `${GALLERY_URL}/admin/occasions?category=${params.category}`
        : `${GALLERY_URL}/admin/occasions`;
        
      const { data } = await API.get(url);
      return data;
    } catch (error: any) {
      console.error('Error fetching admin occasions:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Could not fetch gallery occasions',
      };
    }
  },
}; 