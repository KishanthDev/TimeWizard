import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";


export const fetchEmployees = createAsyncThunk(
    "employees/fetchEmployees",
    async ({ search, sortBy, order, page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/users/get", {
                params: { search, sortBy, order, page, limit }, headers: {
                    Authorization: localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const importUsers = createAsyncThunk(
    "users/importUsers",
    async (file, { rejectWithValue }) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
  
        const response = await axios.post("/api/users/import-csv", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
    }
  );

export const addEmployee = createAsyncThunk(
    "employees/addEmployee",
    async (employeeData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/users/create", employeeData, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            return response.data.user
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const employeeSlice = createSlice({
    name: "employees",
    initialState: {
        employees: [],
        users:[],
        totalUsers: 0,
        currentPage: 1,
        totalPages: 1,
        status: "idle",
        error: null,
        search: "",
        sortBy: "name", // Default sort by name
        order: "asc",
        limit: 5 // Default sort order
    },
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        toggleSortOrder: (state, action) => {
            if (state.sortBy === action.payload) {
                state.order = state.order === "asc" ? "desc" : "asc"; // Toggle order
            } else {
                state.sortBy = action.payload;
                state.order = "asc"; // Reset to ascending when changing column
            }
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
        },
        clearUsers: (state) => {
            state.users = [];
            state.error = [];
            state.success = false;
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.employees = action.payload.users;
                state.totalUsers = action.payload.totalUsers;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Something went wrong";
            })
            .addCase(addEmployee.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.employees.push(action.payload); 
            })
            .addCase(addEmployee.rejected, (state, action) => {
                state.status = "idle";
                state.error = action.payload?.message || "Failed to add employee";
            })
            .addCase(importUsers.pending, (state) => {
                state.loading = true;
                state.success = false;
              })
              .addCase(importUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = action.payload.uploadedUsers;
                state.error = action.payload.errors;
              })
              .addCase(importUsers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = [action.payload];
              });
    },
});


export const { setSearch,clearUsers, toggleSortOrder, setLimit } = employeeSlice.actions;
export default employeeSlice.reducer;
