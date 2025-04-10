import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../services/api';
import { setLoading, addNotification } from './uiSlice';

// Define types
export interface Event {
  _id: string;
  title: string;
  description: string;
  poster_url: string;
  date: string;
  location: string;
  registration_link?: string;
  event_type: 'upcoming' | 'past';
  outcomes?: string;
  tags: string[];
  created_by: string;
  created_at: string;
}

// Define API response types
interface EventsResponse {
  events: Event[];
}

interface EventResponse {
  event: Event;
}

export interface EventState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: EventState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchEvents = createAsyncThunk<EventsResponse, any>(
  'events/fetchEvents',
  async (params: any = {}, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchEvents', isLoading: true }));
      
      const response = await API.events.getAll(params);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch events');
      }
      
      return response.data as EventsResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch events',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch events');
    } finally {
      dispatch(setLoading({ key: 'fetchEvents', isLoading: false }));
    }
  }
);

export const fetchEventById = createAsyncThunk<EventResponse, string>(
  'events/fetchEventById',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchEventById', isLoading: true }));
      
      const response = await API.events.getById(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch event details');
      }
      
      return response.data as EventResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch event details',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch event details');
    } finally {
      dispatch(setLoading({ key: 'fetchEventById', isLoading: false }));
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'createEvent', isLoading: true }));
      
      const response = await API.events.create(formData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create event');
      }
      
      dispatch(addNotification({
        message: 'Event created successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to create event',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to create event');
    } finally {
      dispatch(setLoading({ key: 'createEvent', isLoading: false }));
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, formData }: { id: string; formData: FormData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'updateEvent', isLoading: true }));
      
      const response = await API.events.update(id, formData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update event');
      }
      
      dispatch(addNotification({
        message: 'Event updated successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to update event',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to update event');
    } finally {
      dispatch(setLoading({ key: 'updateEvent', isLoading: false }));
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'deleteEvent', isLoading: true }));
      
      const response = await API.events.delete(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete event');
      }
      
      dispatch(addNotification({
        message: 'Event deleted successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return id;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to delete event',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to delete event');
    } finally {
      dispatch(setLoading({ key: 'deleteEvent', isLoading: false }));
    }
  }
);

// Create slice
export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    setCurrentEvent: (state, action: PayloadAction<Event>) => {
      state.currentEvent = action.payload;
    },
    clearEvents: (state) => {
      state.events = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch all events
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload.events;
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? String(action.payload) : 'An error occurred';
      });
    
    // Fetch event by ID
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.currentEvent = action.payload.event;
        state.loading = false;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? String(action.payload) : 'An error occurred';
      });
    
    // Create event
    builder
      .addCase(createEvent.fulfilled, (state, action) => {
        if (action.payload && action.payload.event) {
          state.events.unshift(action.payload.event);
        }
      });
    
    // Update event
    builder
      .addCase(updateEvent.fulfilled, (state, action) => {
        if (action.payload && action.payload.event) {
          const updatedEvent = action.payload.event;
          state.events = state.events.map(event => 
            event._id === updatedEvent._id ? updatedEvent : event
          );
          if (state.currentEvent && state.currentEvent._id === updatedEvent._id) {
            state.currentEvent = updatedEvent;
          }
        }
      });
    
    // Delete event
    builder
      .addCase(deleteEvent.fulfilled, (state, action) => {
        if (action.payload) {
          const eventId = action.payload;
          state.events = state.events.filter(event => event._id !== eventId);
          if (state.currentEvent && state.currentEvent._id === eventId) {
            state.currentEvent = null;
          }
        }
      });
  },
});

// Export actions
export const { clearCurrentEvent, setCurrentEvent, clearEvents } = eventSlice.actions;

export default eventSlice.reducer; 