import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../services/api';
import { setLoading, addNotification } from './uiSlice';

// Define user type
export interface User {
  _id: string;
  name: string;
  email: string;
  roll_no: string;
  branch: string;
  year: number;
  profile_pic_url?: string;
  bio?: string;
  role: 'member' | 'admin' | 'superadmin';
}

// API response interfaces
interface AuthResponse {
  token: string;
  user: User;
}

interface ProfileResponse {
  user: User;
}

interface ProfilePictureResponse {
  profile_pic_url: string;
}

// Define state
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk<
  AuthResponse, 
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (credentials: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'login', isLoading: true }));
      
      const response = await API.auth.login(credentials);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      
      // Store token in localStorage
      if (typeof window !== 'undefined' && response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      dispatch(addNotification({
        message: 'Login successful',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data as AuthResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Login failed',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Login failed');
    } finally {
      dispatch(setLoading({ key: 'login', isLoading: false }));
    }
  }
);

export const signup = createAsyncThunk<
  AuthResponse,
  any,
  { rejectValue: string }
>(
  'auth/signup',
  async (userData: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'signup', isLoading: true }));
      
      const response = await API.auth.signup(userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Signup failed');
      }
      
      // Store token in localStorage
      if (typeof window !== 'undefined' && response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      dispatch(addNotification({
        message: 'Account created successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data as AuthResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Signup failed',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Signup failed');
    } finally {
      dispatch(setLoading({ key: 'signup', isLoading: false }));
    }
  }
);

export const getProfile = createAsyncThunk<
  ProfileResponse,
  void,
  { rejectValue: string }
>(
  'auth/getProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'getProfile', isLoading: true }));
      
      const response = await API.auth.getProfile();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch profile');
      }
      
      return response.data as ProfileResponse;
    } catch (error: any) {
      // Don't show notification for auth failures - handled by interceptor
      if (error.message !== 'Invalid token. Please log in again.' && 
          error.message !== 'Your token has expired. Please log in again.') {
        dispatch(addNotification({
          message: error.message || 'Failed to fetch profile',
          type: 'error',
          timeout: 5000,
        }));
      }
      
      return rejectWithValue(error.message || 'Failed to fetch profile');
    } finally {
      dispatch(setLoading({ key: 'getProfile', isLoading: false }));
    }
  }
);

export const updateProfile = createAsyncThunk<
  ProfileResponse,
  any,
  { rejectValue: string }
>(
  'auth/updateProfile',
  async (userData: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'updateProfile', isLoading: true }));
      
      const response = await API.user.updateProfile(userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update profile');
      }
      
      dispatch(addNotification({
        message: 'Profile updated successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data as ProfileResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to update profile',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to update profile');
    } finally {
      dispatch(setLoading({ key: 'updateProfile', isLoading: false }));
    }
  }
);

export const uploadProfilePicture = createAsyncThunk<
  ProfilePictureResponse,
  FormData,
  { rejectValue: string }
>(
  'auth/uploadProfilePicture',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'uploadProfilePicture', isLoading: true }));
      
      const response = await API.user.uploadProfilePicture(formData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to upload profile picture');
      }
      
      dispatch(addNotification({
        message: 'Profile picture uploaded successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data as ProfilePictureResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to upload profile picture',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to upload profile picture');
    } finally {
      dispatch(setLoading({ key: 'uploadProfilePicture', isLoading: false }));
    }
  }
);

export const logout = createAsyncThunk<void, void>(
  'auth/logout',
  async (_, { dispatch }) => {
    // Remove token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    
    dispatch(addNotification({
      message: 'Logged out successfully',
      type: 'success',
      timeout: 3000,
    }));
  }
);

// Create slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restoreToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An error occurred';
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
    
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An error occurred';
      });
    
    // Get profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An error occurred';
        
        // If token is invalid, clear auth state
        if (
          action.payload === 'Invalid token. Please log in again.' ||
          action.payload === 'Your token has expired. Please log in again.'
        ) {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
        }
      });
    
    // Update profile
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
    
    // Upload profile picture
    builder
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        if (state.user) {
          state.user.profile_pic_url = action.payload.profile_pic_url;
        }
      });
    
    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
      });
  },
});

// Export actions
export const { restoreToken, clearAuth, clearError } = authSlice.actions;

export default authSlice.reducer; 