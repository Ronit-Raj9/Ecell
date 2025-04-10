import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../services/api';
import { setLoading, addNotification } from './uiSlice';

// Define types
export interface Announcement {
  _id: string;
  title: string;
  content: string;
  created_by: any;
  created_at: string;
  visible_to: 'public' | 'members';
}

// Define API response type
interface AnnouncementsResponse {
  announcements: Announcement[];
}

interface AnnouncementResponse {
  announcement: Announcement;
}

export interface AnnouncementState {
  announcements: Announcement[];
  currentAnnouncement: Announcement | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AnnouncementState = {
  announcements: [],
  currentAnnouncement: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAnnouncements = createAsyncThunk<AnnouncementsResponse>(
  'announcements/fetchAnnouncements',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchAnnouncements', isLoading: true }));
      
      const response = await API.announcements.getAll();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch announcements');
      }
      
      return response.data as AnnouncementsResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch announcements',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch announcements');
    } finally {
      dispatch(setLoading({ key: 'fetchAnnouncements', isLoading: false }));
    }
  }
);

export const fetchAnnouncementById = createAsyncThunk<AnnouncementResponse, string>(
  'announcements/fetchAnnouncementById',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchAnnouncementById', isLoading: true }));
      
      const response = await API.announcements.getById(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch announcement details');
      }
      
      return response.data as AnnouncementResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch announcement details',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch announcement details');
    } finally {
      dispatch(setLoading({ key: 'fetchAnnouncementById', isLoading: false }));
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  'announcements/createAnnouncement',
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'createAnnouncement', isLoading: true }));
      
      const response = await API.announcements.create(data);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create announcement');
      }
      
      dispatch(addNotification({
        message: 'Announcement created successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to create announcement',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to create announcement');
    } finally {
      dispatch(setLoading({ key: 'createAnnouncement', isLoading: false }));
    }
  }
);

export const updateAnnouncement = createAsyncThunk(
  'announcements/updateAnnouncement',
  async ({ id, data }: { id: string; data: any }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'updateAnnouncement', isLoading: true }));
      
      const response = await API.announcements.update(id, data);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update announcement');
      }
      
      dispatch(addNotification({
        message: 'Announcement updated successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to update announcement',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to update announcement');
    } finally {
      dispatch(setLoading({ key: 'updateAnnouncement', isLoading: false }));
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  'announcements/deleteAnnouncement',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'deleteAnnouncement', isLoading: true }));
      
      const response = await API.announcements.delete(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete announcement');
      }
      
      dispatch(addNotification({
        message: 'Announcement deleted successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return id;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to delete announcement',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to delete announcement');
    } finally {
      dispatch(setLoading({ key: 'deleteAnnouncement', isLoading: false }));
    }
  }
);

// Create slice
export const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    clearCurrentAnnouncement: (state) => {
      state.currentAnnouncement = null;
    },
    setCurrentAnnouncement: (state, action: PayloadAction<Announcement>) => {
      state.currentAnnouncement = action.payload;
    },
    clearAnnouncements: (state) => {
      state.announcements = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch all announcements
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.announcements = action.payload.announcements;
        state.loading = false;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? String(action.payload) : 'An error occurred';
      });
    
    // Fetch announcement by ID
    builder
      .addCase(fetchAnnouncementById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncementById.fulfilled, (state, action) => {
        state.currentAnnouncement = action.payload.announcement;
        state.loading = false;
      })
      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? String(action.payload) : 'An error occurred';
      });
    
    // Create announcement
    builder
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        if (action.payload && action.payload.announcement) {
          state.announcements.unshift(action.payload.announcement);
        }
      });
    
    // Update announcement
    builder
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        if (action.payload && action.payload.announcement) {
          const updatedAnnouncement = action.payload.announcement;
          state.announcements = state.announcements.map(announcement => 
            announcement._id === updatedAnnouncement._id ? updatedAnnouncement : announcement
          );
          if (state.currentAnnouncement && state.currentAnnouncement._id === updatedAnnouncement._id) {
            state.currentAnnouncement = updatedAnnouncement;
          }
        }
      });
    
    // Delete announcement
    builder
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        const announcementId = action.payload;
        state.announcements = state.announcements.filter(announcement => announcement._id !== announcementId);
        if (state.currentAnnouncement && state.currentAnnouncement._id === announcementId) {
          state.currentAnnouncement = null;
        }
      });
  },
});

// Export actions
export const { clearCurrentAnnouncement, setCurrentAnnouncement, clearAnnouncements } = announcementSlice.actions;

export default announcementSlice.reducer; 