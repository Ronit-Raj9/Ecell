import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../services/api';
import { setLoading, addNotification } from './uiSlice';

// Define types
export interface Meeting {
  _id: string;
  date: string;
  title: string;
  agenda: string;
  notes_url: string;
  attended_by: any[];
  created_at: string;
}

// Define API response types
interface MeetingsResponse {
  meetings: Meeting[];
}

interface MeetingResponse {
  meeting: Meeting;
}

export interface MeetingState {
  meetings: Meeting[];
  currentMeeting: Meeting | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: MeetingState = {
  meetings: [],
  currentMeeting: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchMeetings = createAsyncThunk<MeetingsResponse, void>(
  'meetings/fetchMeetings',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchMeetings', isLoading: true }));
      
      const response = await API.meetings.getAll();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch meetings');
      }
      
      return response.data as MeetingsResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch meetings',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch meetings');
    } finally {
      dispatch(setLoading({ key: 'fetchMeetings', isLoading: false }));
    }
  }
);

export const fetchMeetingById = createAsyncThunk<MeetingResponse, string>(
  'meetings/fetchMeetingById',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchMeetingById', isLoading: true }));
      
      const response = await API.meetings.getById(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch meeting details');
      }
      
      return response.data as MeetingResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch meeting details',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch meeting details');
    } finally {
      dispatch(setLoading({ key: 'fetchMeetingById', isLoading: false }));
    }
  }
);

export const createMeeting = createAsyncThunk(
  'meetings/createMeeting',
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'createMeeting', isLoading: true }));
      
      const response = await API.meetings.create(data);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create meeting');
      }
      
      dispatch(addNotification({
        message: 'Meeting created successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to create meeting',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to create meeting');
    } finally {
      dispatch(setLoading({ key: 'createMeeting', isLoading: false }));
    }
  }
);

export const updateMeeting = createAsyncThunk(
  'meetings/updateMeeting',
  async ({ id, data }: { id: string; data: any }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'updateMeeting', isLoading: true }));
      
      const response = await API.meetings.update(id, data);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update meeting');
      }
      
      dispatch(addNotification({
        message: 'Meeting updated successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to update meeting',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to update meeting');
    } finally {
      dispatch(setLoading({ key: 'updateMeeting', isLoading: false }));
    }
  }
);

export const deleteMeeting = createAsyncThunk(
  'meetings/deleteMeeting',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'deleteMeeting', isLoading: true }));
      
      const response = await API.meetings.delete(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete meeting');
      }
      
      dispatch(addNotification({
        message: 'Meeting deleted successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return id;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to delete meeting',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to delete meeting');
    } finally {
      dispatch(setLoading({ key: 'deleteMeeting', isLoading: false }));
    }
  }
);

// Create slice
export const meetingSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    clearCurrentMeeting: (state) => {
      state.currentMeeting = null;
    },
    setCurrentMeeting: (state, action: PayloadAction<Meeting>) => {
      state.currentMeeting = action.payload;
    },
    clearMeetings: (state) => {
      state.meetings = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch all meetings
    builder
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.meetings = action.payload.meetings;
        state.loading = false;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? String(action.payload) : 'An error occurred';
      });
    
    // Fetch meeting by ID
    builder
      .addCase(fetchMeetingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetingById.fulfilled, (state, action) => {
        state.currentMeeting = action.payload.meeting;
        state.loading = false;
      })
      .addCase(fetchMeetingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? String(action.payload) : 'An error occurred';
      });
    
    // Create meeting
    builder
      .addCase(createMeeting.fulfilled, (state, action) => {
        if (action.payload && action.payload.meeting) {
          state.meetings.unshift(action.payload.meeting);
        }
      });
    
    // Update meeting
    builder
      .addCase(updateMeeting.fulfilled, (state, action) => {
        if (action.payload && action.payload.meeting) {
          const updatedMeeting = action.payload.meeting;
          state.meetings = state.meetings.map(meeting => 
            meeting._id === updatedMeeting._id ? updatedMeeting : meeting
          );
          if (state.currentMeeting && state.currentMeeting._id === updatedMeeting._id) {
            state.currentMeeting = updatedMeeting;
          }
        }
      });
    
    // Delete meeting
    builder
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        if (action.payload) {
          const meetingId = action.payload;
          state.meetings = state.meetings.filter(meeting => meeting._id !== meetingId);
          if (state.currentMeeting && state.currentMeeting._id === meetingId) {
            state.currentMeeting = null;
          }
        }
      });
  },
});

// Export actions
export const { clearCurrentMeeting, setCurrentMeeting, clearMeetings } = meetingSlice.actions;

export default meetingSlice.reducer; 