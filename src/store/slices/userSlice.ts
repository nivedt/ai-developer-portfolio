import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  title?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  website?: string;
  phone?: string;
  projects?: any[];
  skills?: any[];
  experiences?: any[];
  educations?: any[];
}

interface UserState {
  profile: UserProfile | null;
  stats: {
    projects: number;
    skills: number;
    experience: number;
    achievements: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  stats: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://ai-developer-portfolio-production.up.railway.app/api/user/profile');
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch profile');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'user/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://ai-developer-portfolio-production.up.railway.app/api/user/stats');
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch stats');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch stats
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;