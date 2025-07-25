import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Project {
  id: number;
  title: string;
  description: string;
  aiDescription?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrls: string[];
  featured: boolean;
  startDate?: string;
  endDate?: string;
  status: string;
  category?: string;
  createdAt: string;
}

interface ProjectsState {
  projects: Project[];
  featuredProjects: Project[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  featuredProjects: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch projects');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
        state.featuredProjects = action.payload.filter((project: Project) => project.featured);
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;