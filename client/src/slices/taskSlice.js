import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

// Fetch tasks for a specific project and employee
export const fetchTasks = createAsyncThunk(
  "/tasks/get", 
  async ({ projectId, employeeId }) => {
    const response = await axios.get(`/api/tasks/${projectId}/${employeeId}`, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    return response.data;
  }
);

// Fetch all tasks for the admin or other use cases
export const fetchAllTasks = createAsyncThunk(
  "/tasks/getAll", 
  async () => {
    const response = await axios.get(`/api/tasks/getAll`);
    return response.data;
  }
);

export const clockIn = createAsyncThunk(
  "/tasks/clockIn", 
  async ({taskId},{rejectWithValue}) => {
    try {
      const response = await axios.post(
        `/api/tasks/clockIn/${taskId}`,"",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clock in");
    }
  }
);

// Clock out action
export const clockOut = createAsyncThunk(
  "/tasks/clockOut", 
  async ({taskId}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/api/tasks/clockOut/${taskId}`,"",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clock out");
    }
  }
);

export const completeTask = createAsyncThunk(
  "/tasks/completeTask", 
  async ({taskId}, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/tasks/completeTask/${taskId}`,"",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clock out");
    }
  }
);

export const fetchMyTasks = createAsyncThunk(
  "/tasks/getMy", 
  async () => {
    const response = await axios.get(`/api/tasks/get`,{headers:{Authorization:localStorage.getItem("token")}});
    return response.data;
  }
);

// Selector to get employee status based on task data
export const selectEmployeeStatus = (state) => {
  return state.task.tasks.map((task) => {
    const activeEmployees =
      task.status === "ongoing" || task.timeSpent.some((entry) => entry.clockIn);
    return {
      taskId: task._id,
      assignedTo: task.assignedTo,
      status: activeEmployees ? "Active" : "Inactive",
    };
  });
};

// Assign a task to an employee
export const assignTask = createAsyncThunk(
  "tasks/assignTask", 
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `api/tasks/create/${taskData.assignedTo}`,
        taskData, {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to assign task");
    }
  }
);

// Initial state for the task slice
const taskSlice = createSlice({
  name: "task",
  initialState: { 
    tasks: [], 
    allTasks: [],
    myTasks:[], // Store all tasks separately
    isLoading: null, 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handling fetching specific tasks for a project/employee
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload; // Store specific tasks in `tasks` array
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Handling fetching all tasks
      .addCase(fetchAllTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allTasks = action.payload; // Store all tasks in `allTasks` array
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Handling task assignment
      .addCase(assignTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.push(action.payload); // Add the new task to tasks list
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myTasks = action.payload; 
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export default taskSlice.reducer;
