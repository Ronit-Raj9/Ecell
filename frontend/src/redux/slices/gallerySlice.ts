import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../services/api';
import { setLoading, addNotification } from './uiSlice';

// Define types
export interface GalleryOccasion {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: 'events' | 'workshops' | 'competitions' | 'activities';
  cover_image?: string;
  created_by: {
    _id: string;
    name: string;
    email: string;
  };
  is_published: boolean;
  photo_count?: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryPhoto {
  _id: string;
  occasion_id: string;
  image_url: string;
  caption: string;
  uploaded_by: {
    _id: string;
    name: string;
    email: string;
  };
  is_approved: boolean;
  likes: number;
  created_at: string;
  updated_at: string;
}

// Define state
export interface GalleryState {
  occasions: GalleryOccasion[];
  currentOccasion: GalleryOccasion | null;
  photos: GalleryPhoto[];
  pendingApprovalPhotos: GalleryPhoto[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: GalleryState = {
  occasions: [],
  currentOccasion: null,
  photos: [],
  pendingApprovalPhotos: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchGalleryOccasions = createAsyncThunk<
  { occasions: GalleryOccasion[] },
  { category?: string } | undefined,
  { rejectValue: string }
>(
  'gallery/fetchGalleryOccasions',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchGalleryOccasions', isLoading: true }));
      
      const response = await API.gallery.getOccasions(params);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch gallery occasions');
      }
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch gallery occasions',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch gallery occasions');
    } finally {
      dispatch(setLoading({ key: 'fetchGalleryOccasions', isLoading: false }));
    }
  }
);

export const fetchOccasionById = createAsyncThunk<
  { occasion: GalleryOccasion; photos: GalleryPhoto[] },
  string,
  { rejectValue: string }
>(
  'gallery/fetchOccasionById',
  async (occasionId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchOccasionById', isLoading: true }));
      
      const response = await API.gallery.getOccasionById(occasionId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch gallery occasion');
      }
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch gallery occasion',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch gallery occasion');
    } finally {
      dispatch(setLoading({ key: 'fetchOccasionById', isLoading: false }));
    }
  }
);

export const createGalleryOccasion = createAsyncThunk<
  { occasion: GalleryOccasion },
  {
    title: string;
    description: string;
    date: string;
    category: 'events' | 'workshops' | 'competitions' | 'activities';
    is_published?: boolean;
  },
  { rejectValue: string }
>(
  'gallery/createGalleryOccasion',
  async (occasionData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'createGalleryOccasion', isLoading: true }));
      
      const response = await API.gallery.createOccasion(occasionData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create gallery occasion');
      }
      
      dispatch(addNotification({
        message: 'Gallery occasion created successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to create gallery occasion',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to create gallery occasion');
    } finally {
      dispatch(setLoading({ key: 'createGalleryOccasion', isLoading: false }));
    }
  }
);

export const updateGalleryOccasion = createAsyncThunk<
  { occasion: GalleryOccasion },
  {
    id: string;
    title?: string;
    description?: string;
    date?: string;
    category?: 'events' | 'workshops' | 'competitions' | 'activities';
    is_published?: boolean;
  },
  { rejectValue: string }
>(
  'gallery/updateGalleryOccasion',
  async ({ id, ...occasionData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'updateGalleryOccasion', isLoading: true }));
      
      const response = await API.gallery.updateOccasion(id, occasionData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update gallery occasion');
      }
      
      dispatch(addNotification({
        message: 'Gallery occasion updated successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to update gallery occasion',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to update gallery occasion');
    } finally {
      dispatch(setLoading({ key: 'updateGalleryOccasion', isLoading: false }));
    }
  }
);

export const deleteGalleryOccasion = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'gallery/deleteGalleryOccasion',
  async (occasionId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'deleteGalleryOccasion', isLoading: true }));
      
      const response = await API.gallery.deleteOccasion(occasionId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete gallery occasion');
      }
      
      dispatch(addNotification({
        message: 'Gallery occasion and associated photos deleted successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return occasionId;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to delete gallery occasion',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to delete gallery occasion');
    } finally {
      dispatch(setLoading({ key: 'deleteGalleryOccasion', isLoading: false }));
    }
  }
);

export const uploadGalleryPhoto = createAsyncThunk<
  { photo: GalleryPhoto },
  {
    formData: FormData;
    occasionId: string;
  },
  { rejectValue: string }
>(
  'gallery/uploadGalleryPhoto',
  async ({ formData, occasionId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'uploadGalleryPhoto', isLoading: true }));
      
      const response = await API.gallery.uploadPhoto(formData);
      console.log('Upload gallery photo response:', response);
      
      // Consider the upload successful if we get a response with success flag
      // or if we have data in the response (fallback)
      if (response.success || (response.data && Object.keys(response.data).length > 0)) {
        dispatch(addNotification({
          message: response.message || 'Photo uploaded successfully',
          type: 'success',
          timeout: 3000,
        }));
        
        // Refresh the photos for this occasion
        dispatch(fetchOccasionById(occasionId));
        
        // Ensure we return a valid response object with photo property
        return {
          photo: response.data?.photo || response.data?.photos?.[0] || {} as GalleryPhoto
        };
      }
      
      // If we reach here, consider it an error
      throw new Error(response.message || 'Failed to upload gallery photo');
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to upload gallery photo',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to upload gallery photo');
    } finally {
      dispatch(setLoading({ key: 'uploadGalleryPhoto', isLoading: false }));
    }
  }
);

export const setOccasionCoverImage = createAsyncThunk<
  { occasion: GalleryOccasion },
  {
    occasionId: string;
    photoId: string;
  },
  { rejectValue: string }
>(
  'gallery/setOccasionCoverImage',
  async ({ occasionId, photoId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'setOccasionCoverImage', isLoading: true }));
      
      const response = await API.gallery.setOccasionCover(occasionId, photoId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to set cover image');
      }
      
      dispatch(addNotification({
        message: 'Cover image updated successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to set cover image',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to set cover image');
    } finally {
      dispatch(setLoading({ key: 'setOccasionCoverImage', isLoading: false }));
    }
  }
);

export const deleteGalleryPhoto = createAsyncThunk<
  string,
  {
    photoId: string;
    occasionId: string;
  },
  { rejectValue: string }
>(
  'gallery/deleteGalleryPhoto',
  async ({ photoId, occasionId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'deleteGalleryPhoto', isLoading: true }));
      
      const response = await API.gallery.deletePhoto(photoId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete gallery photo');
      }
      
      dispatch(addNotification({
        message: 'Photo deleted successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      // Refresh the photos for this occasion
      dispatch(fetchOccasionById(occasionId));
      
      return photoId;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to delete gallery photo',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to delete gallery photo');
    } finally {
      dispatch(setLoading({ key: 'deleteGalleryPhoto', isLoading: false }));
    }
  }
);

export const fetchPendingApprovalPhotos = createAsyncThunk<
  { photos: GalleryPhoto[] },
  void,
  { rejectValue: string }
>(
  'gallery/fetchPendingApprovalPhotos',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchPendingApprovalPhotos', isLoading: true }));
      
      const response = await API.gallery.getPendingApprovalPhotos();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch pending approval photos');
      }
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch pending approval photos',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch pending approval photos');
    } finally {
      dispatch(setLoading({ key: 'fetchPendingApprovalPhotos', isLoading: false }));
    }
  }
);

export const updateGalleryPhoto = createAsyncThunk<
  { photo: GalleryPhoto },
  {
    photoId: string;
    caption?: string;
    is_approved?: boolean;
    occasionId?: string;
  },
  { rejectValue: string }
>(
  'gallery/updateGalleryPhoto',
  async ({ photoId, caption, is_approved, occasionId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'updateGalleryPhoto', isLoading: true }));
      
      const response = await API.gallery.updatePhoto(photoId, { caption, is_approved });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update gallery photo');
      }
      
      dispatch(addNotification({
        message: 'Photo updated successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      // If approving a photo and we have the occasion ID, refresh the occasion photos
      if (is_approved === true && occasionId) {
        dispatch(fetchOccasionById(occasionId));
      }
      
      // If we're approving photos, also refresh the pending approval list
      if (is_approved === true) {
        dispatch(fetchPendingApprovalPhotos());
      }
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to update gallery photo',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to update gallery photo');
    } finally {
      dispatch(setLoading({ key: 'updateGalleryPhoto', isLoading: false }));
    }
  }
);

export const fetchAdminGalleryOccasions = createAsyncThunk<
  { occasions: GalleryOccasion[] },
  { category?: string } | undefined,
  { rejectValue: string }
>(
  'gallery/fetchAdminGalleryOccasions',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchAdminGalleryOccasions', isLoading: true }));
      
      // Use the correct function for admin occasions
      console.log('Fetching admin occasions with params:', params);
      const response = await API.gallery.getAdminOccasions(params);
      console.log('Admin occasions response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch gallery occasions');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error in fetchAdminGalleryOccasions:', error);
      dispatch(addNotification({
        message: error.message || 'Failed to fetch gallery occasions',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch gallery occasions');
    } finally {
      dispatch(setLoading({ key: 'fetchAdminGalleryOccasions', isLoading: false }));
    }
  }
);

// Create slice
export const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    clearGalleryState: (state) => {
      state.occasions = [];
      state.currentOccasion = null;
      state.photos = [];
      state.pendingApprovalPhotos = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch gallery occasions
    builder
      .addCase(fetchGalleryOccasions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalleryOccasions.fulfilled, (state, action) => {
        state.occasions = action.payload.occasions;
        state.loading = false;
      })
      .addCase(fetchGalleryOccasions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An error occurred';
      });
    
    // Fetch occasion by ID
    builder
      .addCase(fetchOccasionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOccasionById.fulfilled, (state, action) => {
        state.currentOccasion = action.payload.occasion;
        state.photos = action.payload.photos;
        state.loading = false;
      })
      .addCase(fetchOccasionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An error occurred';
      });
      
    // Create gallery occasion
    builder
      .addCase(createGalleryOccasion.fulfilled, (state, action) => {
        state.occasions.unshift(action.payload.occasion);
      });
      
    // Update gallery occasion
    builder
      .addCase(updateGalleryOccasion.fulfilled, (state, action) => {
        const index = state.occasions.findIndex(o => o._id === action.payload.occasion._id);
        if (index !== -1) {
          state.occasions[index] = action.payload.occasion;
        }
        
        if (state.currentOccasion && state.currentOccasion._id === action.payload.occasion._id) {
          state.currentOccasion = action.payload.occasion;
        }
      });
      
    // Delete gallery occasion
    builder
      .addCase(deleteGalleryOccasion.fulfilled, (state, action) => {
        state.occasions = state.occasions.filter(o => o._id !== action.payload);
        
        if (state.currentOccasion && state.currentOccasion._id === action.payload) {
          state.currentOccasion = null;
          state.photos = [];
        }
      });
      
    // Set occasion cover image
    builder
      .addCase(setOccasionCoverImage.fulfilled, (state, action) => {
        const index = state.occasions.findIndex(o => o._id === action.payload.occasion._id);
        if (index !== -1) {
          state.occasions[index] = action.payload.occasion;
        }
        
        if (state.currentOccasion && state.currentOccasion._id === action.payload.occasion._id) {
          state.currentOccasion = action.payload.occasion;
        }
      });
      
    // Upload gallery photo
    builder
      .addCase(uploadGalleryPhoto.fulfilled, (state, action) => {
        if (action.payload.photo.is_approved) {
          state.photos.unshift(action.payload.photo);
        }
      });
      
    // Delete gallery photo
    builder
      .addCase(deleteGalleryPhoto.fulfilled, (state, action) => {
        state.photos = state.photos.filter(p => p._id !== action.payload);
        state.pendingApprovalPhotos = state.pendingApprovalPhotos.filter(
          p => p._id !== action.payload
        );
      });
      
    // Fetch pending approval photos
    builder
      .addCase(fetchPendingApprovalPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingApprovalPhotos.fulfilled, (state, action) => {
        state.pendingApprovalPhotos = action.payload.photos;
        state.loading = false;
      })
      .addCase(fetchPendingApprovalPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An error occurred';
      });
      
    // Update gallery photo
    builder
      .addCase(updateGalleryPhoto.fulfilled, (state, action) => {
        // Update in photos array if exists
        const photoIndex = state.photos.findIndex(p => p._id === action.payload.photo._id);
        if (photoIndex !== -1) {
          state.photos[photoIndex] = action.payload.photo;
        }
        
        // Update in pending approval photos if exists
        const pendingIndex = state.pendingApprovalPhotos.findIndex(
          p => p._id === action.payload.photo._id
        );
        if (pendingIndex !== -1) {
          // If the photo is now approved, remove it from pending
          if (action.payload.photo.is_approved) {
            state.pendingApprovalPhotos.splice(pendingIndex, 1);
          } else {
            // Otherwise update it
            state.pendingApprovalPhotos[pendingIndex] = action.payload.photo;
          }
        }
      });
      
    // Fetch admin gallery occasions
    builder
      .addCase(fetchAdminGalleryOccasions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminGalleryOccasions.fulfilled, (state, action) => {
        state.occasions = action.payload.occasions;
        state.loading = false;
      })
      .addCase(fetchAdminGalleryOccasions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An error occurred';
      });
  },
});

export const { clearGalleryState } = gallerySlice.actions;

export default gallerySlice.reducer; 