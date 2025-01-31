import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";


// Fetch Projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/projects/get",{headers:{Authorization:localStorage.getItem("token")}});
      return response.data.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch projects");
    }
  }
);

// Create Project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/projects/create", projectData, {
        headers: {Authorization:localStorage.getItem("token") },
      });
      return response.data.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create project");
    }
  }
);

// Delete Project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      await axios.delete("");
      return projectId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete project");
    }
  }
);

// Project Slice
const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((project) => project._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default projectSlice.reducer;
