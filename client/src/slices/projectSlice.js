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

export const fetchMyProject = createAsyncThunk(
  "projects/fetchMyProjects",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/get`);
      return response.data;
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
  async ({id}, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/projects/${id}/remove`,{headers:{Authorization:localStorage.getItem("token")}});
      return id;
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
    myProject:null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setRemProjectId:(state)=>{

    },
    setEditProjectId:(state)=>{

    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload;
      })

      // Create Project
      .addCase(createProject.pending,(state)=>{state.isLoading=true})
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading=false
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading=false
        state.error = action.payload;
      })

      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((project) => project._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchMyProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchMyProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.myProject = action.payload;
      })
      .addCase(fetchMyProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload;
      })
  },
});


export const {setRemProjectId,setEditProjectId} = projectSlice.actions
export default projectSlice.reducer;
