import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timeout?: number;
}

export interface UIState {
  loading: {
    [key: string]: boolean;
  };
  notifications: Notification[];
}

// Initial state
const initialState: UIState = {
  loading: {},
  notifications: [],
};

// Create slice
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Set loading state for a specific action
    setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload;
      state.loading[key] = isLoading;
    },
    
    // Add a notification
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({
        ...action.payload,
        id,
      });
    },
    
    // Remove a notification by ID
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    
    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

// Export actions
export const {
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer; 