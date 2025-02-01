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

const employeeSlice = createSlice({
    name: "employees",
    initialState: {
        employees: [],
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
            });
    },
});


export const { setSearch, toggleSortOrder, setLimit } = employeeSlice.actions;
export default employeeSlice.reducer;
