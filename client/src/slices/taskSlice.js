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

export const updateTaskDetails = createAsyncThunk(
  'tasks/updateTaskDetails',
  async ({ taskId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, updatedData);
      return response.data; // The updated task data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Something went wrong');
    }
  }
);

// Fetch all tasks for the admin or other use cases
export const fetchAllTasks = createAsyncThunk(
  "/tasks/getAll", 
  async () => {
    const response = await axios.get(`/api/tasks/getAll`,{headers:{Authorization:localStorage.getItem("token")}});
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
      return response.data.task;
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
      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clock out");
    }
  }
);

export const completeTask = createAsyncThunk(
  "/tasks/completeTask", 
  async ({taskId,submissionData}, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/tasks/completeTask/${taskId}`,submissionData,
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

export const resubmitTask = createAsyncThunk("tasks/updateTask",async(taskId)=>{
  try {
    const response = await axios.put(`/api/tasks/update/${taskId}`)
    return response.data.task
  } catch (error) {
    console.log(error);
  }
})

export const approveTask = createAsyncThunk("tasks/approveTask", async (taskId, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/tasks/approveTask/${taskId}`);
    return response.data.task;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Request Revision
export const requestRevision = createAsyncThunk(
  "tasks/requestRevision",
  async ({ taskId, feedback }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/tasks/revision/${taskId}`, { feedback });
      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Initial state for the task slice
const taskSlice = createSlice({
  name: "task",
  initialState: { 
    tasks: [],
    pendingReviewTasks: [], 
    clockedInTasks:{},
    allTasks: [],
    myTasks:[],
    isLoading: null, 
    error: null 
  },
  reducers: {
    setPendingReviewTasks: (state) => {
      const pendingTasks  = state.allTasks.filter(ele=>ele.status==="pending_review")
      state.pendingReviewTasks = pendingTasks
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload; // Store specific tasks in `tasks` array
      })
      
      // Handling fetching all tasks
      .addCase(fetchAllTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allTasks = action.payload; // Store all tasks in `allTasks` array
      })
      // Handling task assignment
      .addCase(assignTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allTasks.push(action.payload) 
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
      .addCase(resubmitTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.myTasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.myTasks[index] = action.payload;
        }
      })
      .addCase(approveTask.fulfilled, (state, action) => {
        state.pendingReviewTasks = state.pendingReviewTasks.filter(
          (task) => task._id !== action.payload._id
        );
      })
      .addCase(requestRevision.fulfilled, (state, action) => {
        state.pendingReviewTasks = state.pendingReviewTasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(approveTask.rejected, (state, action) => {
        state.error = action.payload.message;
      })
      .addCase(requestRevision.rejected, (state, action) => {
        state.error = action.payload.message;
      })
      .addCase(clockIn.fulfilled, (state, action) => {
        const { _id } = action.payload;
        state.clockedInTasks[_id] = true; // Mark task as clocked in
      })
      .addCase(clockOut.fulfilled, (state, action) => {
        const { _id } = action.payload;
        state.clockedInTasks[_id] = false; // Mark task as clocked out
      })
      .addCase(updateTaskDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTaskDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTask = action.payload;
        state.allTasks = state.allTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
      })
      .addCase(updateTaskDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});


export const {setPendingReviewTasks} = taskSlice.actions
export default taskSlice.reducer;
