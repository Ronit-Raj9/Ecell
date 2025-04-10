import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../../services/api';
import { setLoading, addNotification } from './uiSlice';

// Define types
export interface TeamMember {
  _id: string;
  name: string;
  email?: string;
  roll_no: string;
  branch: string;
  year: number;
  profile_pic_url?: string;
  position: string;
  team_type: 'core' | 'member';
  department: string;
  batch_year: number;
  order: number;
  is_active: boolean;
  added_by: any;
  added_at: string;
}

// Define API response types
interface TeamMembersResponse {
  core: TeamMember[];
  members: TeamMember[];
}

interface TeamMemberResponse {
  teamMember: TeamMember;
}

interface DeleteTeamMemberResponse {
  id: string;
  teamMember: TeamMember;
}

export interface TeamState {
  core: TeamMember[];
  members: TeamMember[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TeamState = {
  core: [],
  members: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTeamMembers = createAsyncThunk<TeamMembersResponse, any>(
  'team/fetchTeamMembers',
  async (params: any = {}, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'fetchTeamMembers', isLoading: true }));
      
      const response = await API.team.getAll(params);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch team members');
      }
      
      return response.data as TeamMembersResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to fetch team members',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to fetch team members');
    } finally {
      dispatch(setLoading({ key: 'fetchTeamMembers', isLoading: false }));
    }
  }
);

export const createTeamMember = createAsyncThunk<TeamMemberResponse, FormData>(
  'team/createTeamMember',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'createTeamMember', isLoading: true }));
      
      const response = await API.team.create(formData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to add team member');
      }
      
      dispatch(addNotification({
        message: 'Team member added successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data as TeamMemberResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to add team member',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to add team member');
    } finally {
      dispatch(setLoading({ key: 'createTeamMember', isLoading: false }));
    }
  }
);

export const updateTeamMember = createAsyncThunk<TeamMemberResponse, { id: string; formData: FormData }>(
  'team/updateTeamMember',
  async ({ id, formData }: { id: string; formData: FormData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'updateTeamMember', isLoading: true }));
      
      const response = await API.team.update(id, formData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update team member');
      }
      
      dispatch(addNotification({
        message: 'Team member updated successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return response.data as TeamMemberResponse;
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to update team member',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to update team member');
    } finally {
      dispatch(setLoading({ key: 'updateTeamMember', isLoading: false }));
    }
  }
);

export const deleteTeamMember = createAsyncThunk<DeleteTeamMemberResponse, string>(
  'team/deleteTeamMember',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'deleteTeamMember', isLoading: true }));
      
      const response = await API.team.delete(id);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to remove team member');
      }
      
      dispatch(addNotification({
        message: 'Team member removed successfully',
        type: 'success',
        timeout: 3000,
      }));
      
      return { id, teamMember: (response.data as { teamMember: TeamMember }).teamMember };
    } catch (error: any) {
      dispatch(addNotification({
        message: error.message || 'Failed to remove team member',
        type: 'error',
        timeout: 5000,
      }));
      
      return rejectWithValue(error.message || 'Failed to remove team member');
    } finally {
      dispatch(setLoading({ key: 'deleteTeamMember', isLoading: false }));
    }
  }
);

// Create slice
export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    clearTeamMembers: (state) => {
      state.core = [];
      state.members = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch team members
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.core = action.payload.core;
        state.members = action.payload.members;
        state.loading = false;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? String(action.payload) : 'An error occurred';
      });
    
    // Create team member
    builder
      .addCase(createTeamMember.fulfilled, (state, action) => {
        const newMember = action.payload.teamMember;
        if (newMember.team_type === 'core') {
          state.core.push(newMember);
        } else {
          state.members.push(newMember);
        }
      });
    
    // Update team member
    builder
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        const updatedMember = action.payload.teamMember;
        
        // If team type has changed, move between core and members arrays
        if (updatedMember.team_type === 'core') {
          // Remove from members if present
          state.members = state.members.filter(member => member._id !== updatedMember._id);
          
          // Update in core if present, else add
          const coreIndex = state.core.findIndex(member => member._id === updatedMember._id);
          if (coreIndex >= 0) {
            state.core[coreIndex] = updatedMember;
          } else {
            state.core.push(updatedMember);
          }
        } else {
          // Remove from core if present
          state.core = state.core.filter(member => member._id !== updatedMember._id);
          
          // Update in members if present, else add
          const memberIndex = state.members.findIndex(member => member._id === updatedMember._id);
          if (memberIndex >= 0) {
            state.members[memberIndex] = updatedMember;
          } else {
            state.members.push(updatedMember);
          }
        }
      });
    
    // Delete team member
    builder
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        const { id, teamMember } = action.payload;
        
        // If 'is_active' is now false, remove from both lists
        state.core = state.core.filter(member => member._id !== id);
        state.members = state.members.filter(member => member._id !== id);
      });
  },
});

// Export actions
export const { clearTeamMembers } = teamSlice.actions;

export default teamSlice.reducer; 