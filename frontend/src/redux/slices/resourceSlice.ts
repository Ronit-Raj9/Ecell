import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../services/api';
import { setLoading, addNotification } from './uiSlice';

// Define types
export interface Resource {
  _id: string;
  title: string;
  file_url: string;
  description: string;
  uploaded_by: any;
  uploaded_at: string;
  category: 'guide' | 'checklist' | 'meeting_notes';
  visibility: 'public' | 'members-only';
}

// Define API response types
interface ResourcesResponse {
  resources: Resource[];
}

interface ResourceResponse {
  resource: Resource;
}

export interface ResourceState {
  resources: Resource[];
  currentResource: Resource | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ResourceState = {
  resources: [],
  currentResource: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchResources = createAsyncThunk<ResourcesResponse, any>(
  'resources/fetchResources',
  async (params: any = {}, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchResources', isLoading: true }));
      
      const response = await API.resources.getAll(params);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch resources');
      }
      
      return response.data as ResourcesResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch resources',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch resources');
    } finally {
      dispatch(setLoading({ key: 'fetchResources', isLoading: false }));
    }
  }
);

export const fetchResourceById = createAsyncThunk<ResourceResponse, string>(
  'resources/fetchResourceById',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchResourceById', isLoading: true }));
      
      const response = await API.resources.getById(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch resource details');
      }
      
      return response.data as ResourceResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch resource details',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch resource details');
    } finally {
      dispatch(setLoading({ key: 'fetchResourceById', isLoading: false }));
    }
  }
);

export const uploadResource = createAsyncThunk(
  'resources/uploadResource',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'uploadResource', isLoading: true }));
      
      const response = await API.resources.upload(formData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to upload resource');
      }
      
      dispatch(addNotification({
        message: 'Resource uploaded successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to upload resource',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to upload resource');
    } finally {
      dispatch(setLoading({ key: 'uploadResource', isLoading: false }));
    }
  }
);

export const updateResource = createAsyncThunk(
  'resources/updateResource',
  async ({ id, data }: { id: string; data: any }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'updateResource', isLoading: true }));
      
      const response = await API.resources.update(id, data);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update resource');
      }
      
      dispatch(addNotification({
        message: 'Resource updated successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to update resource',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to update resource');
    } finally {
      dispatch(setLoading({ key: 'updateResource', isLoading: false }));
    }
  }
);

export const deleteResource = createAsyncThunk(
  'resources/deleteResource',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'deleteResource', isLoading: true }));
      
      const response = await API.resources.delete(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete resource');
      }
      
      dispatch(addNotification({
        message: 'Resource deleted successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return id;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to delete resource',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to delete resource');
    } finally {
      dispatch(setLoading({ key: 'deleteResource', isLoading: false }));
    }
  }
);

// Create slice
export const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    clearCurrentResource: (state) => {
      state.currentResource = null;
    },
    setCurrentResource: (state, action: PayloadAction<Resource>) => {
      state.currentResource = action.payload;
    },
    clearResources: (state) => {
      state.resources = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch all resources
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.resources = action.payload.resources;
        state.loading = false;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? String(action.payload) : 'An error occurred';
      });
    
    // Fetch resource by ID
    builder
      .addCase(fetchResourceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourceById.fulfilled, (state, action) => {
        state.currentResource = action.payload.resource;
        state.loading = false;
      })
      .addCase(fetchResourceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? String(action.payload) : 'An error occurred';
      });
    
    // Upload resource
    builder
      .addCase(uploadResource.fulfilled, (state, action) => {
        if (action.payload && action.payload.resource) {
          state.resources.unshift(action.payload.resource);
        }
      });
    
    // Update resource
    builder
      .addCase(updateResource.fulfilled, (state, action) => {
        if (action.payload && action.payload.resource) {
          const updatedResource = action.payload.resource;
          state.resources = state.resources.map(resource => 
            resource._id === updatedResource._id ? updatedResource : resource
          );
          if (state.currentResource && state.currentResource._id === updatedResource._id) {
            state.currentResource = updatedResource;
          }
        }
      });
    
    // Delete resource
    builder
      .addCase(deleteResource.fulfilled, (state, action) => {
        if (action.payload !== undefined) {
          const resourceId = action.payload;
          state.resources = state.resources.filter(resource => resource._id !== resourceId);
          if (state.currentResource && state.currentResource._id === resourceId) {
            state.currentResource = null;
          }
        }
      });
  },
});

// Export actions
export const { clearCurrentResource, setCurrentResource, clearResources } = resourceSlice.actions;

export default resourceSlice.reducer; 