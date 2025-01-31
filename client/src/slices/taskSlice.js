import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const fetchTasks = createAsyncThunk("/tasks/get", async ({projectId,employeeId}) => {
  const response = await axios.get(`/api/tasks/${projectId}/${employeeId}`, { headers: { Authorization: localStorage.getItem("token") } })
  return response.data
})

export const assignTask = createAsyncThunk(
  "tasks/assignTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`api/tasks/create/${taskData.assignedTo}`,taskData,{
        headers:{Authorization:localStorage.getItem("token")}
      });
      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to assign task");
    }
  }
);


const taskSlice = createSlice({
  name: "task",
  initialState: { tasks: [], isLoading: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.isLoading = true })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload
      })
      .addCase(assignTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks = action.payload;
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer