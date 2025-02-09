import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

// Async thunk to fetch activity logs with filters & pagination
export const fetchActivities = createAsyncThunk(
    "activities/fetchActivities",
    async ({ page = 1, limit = 5, userId = "", search = "", sortOrder = "desc" }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/activities/get", {
                params: { page, limit, userId, search, sortBy: "timestamp", sortOrder }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch activities");
        }
    }
);

const activitySlice = createSlice({
    name: "activities",
    initialState: {
        activities: [],
        totalPages: 1,
        page: 1,
        status: "idle", // "idle" | "loading" | "succeeded" | "failed"
        error: null
    },
    reducers: {
        resetActivities: (state) => {
            state.activities = [];
            state.totalPages = 1;
            state.page = 1;
            state.status = "idle";
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivities.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchActivities.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.activities = action.payload.activities;
                state.totalPages = action.payload.totalPages;
                state.page = action.payload.page;
            })
            .addCase(fetchActivities.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    }
});

export const { resetActivities } = activitySlice.actions;
export default activitySlice.reducer;
