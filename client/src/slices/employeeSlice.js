import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";


export const fetchEmployees = createAsyncThunk(
    "employees/fetchEmployees",
    async ({ search, sortBy, order, page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/users/get", {
                params: search || sortBy || order || page || limit ? { search, sortBy, order, page, limit } : undefined,
                headers: {
                    Authorization: localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteEmployee = createAsyncThunk("employees/deleteEmployee", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/users/${id}/remove`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })

        return id; // Return deleted employee's ID
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

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

export const editEmployee = createAsyncThunk("/api/updateProfile", async ({ id, formData }) => {
    const response = await axios.put(`/api/users/${id}/edit`, formData)
    return response.data.user;
});

const employeeSlice = createSlice({
    name: "employees",
    initialState: {
        employees: [],
        importedUsers: [],
        totalUsers: 0,
        currentPage: 1,
        totalPages: 1,
        status: "idle",
        error: null,
        search: "",
        sortBy: "name",
        order: "asc",
        limit: 5,
        selectedEmployee: null,
    },
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        toggleSortOrder: (state, action) => {
            if (state.sortBy === action.payload) {
                state.order = state.order === "asc" ? "desc" : "asc";// Toggle order
            } else {
                state.sortBy = action.payload;
                state.order = "asc";
            }
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
        },
        clearUsers: (state) => {
            state.importedUsers = [];
            state.error = [];
        },
        setEditEmp: (state, action) => {
            state.selectedEmployee = action.payload
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.employees = action.payload.users || state.employees;
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
                state.status = "loading";
            })
            .addCase(importUsers.fulfilled, (state, action) => {
                state.status = "succeeded";

                // Ensure uploadedUsers is an array
                state.importedUsers = Array.isArray(action.payload.uploadedUsers) ? action.payload.uploadedUsers : [];

                // Extract only the error messages from errors array
                if (Array.isArray(action.payload.errors)) {
                    state.error = action.payload.errors.map(err =>
                        `User: ${err.user.name} (${err.user.email}) - ${err.error}`
                    );
                } else {
                    state.error = [];
                }
            })
            .addCase(importUsers.rejected, (state, action) => {
                state.status = "idle";
                state.error = [action.payload];
            })
            .addCase(deleteEmployee.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.employees = state.employees.filter((emp) => emp._id !== action.payload);
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(editEmployee.pending, (state) => {
                state.status = "loading";
            })
            .addCase(editEmployee.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.employees = state.employees.map((employee) =>
                    employee._id === action.payload._id ? action.payload : employee
                );
            })
            .addCase(editEmployee.rejected, (state, action) => {
                state.status = "idle";
                state.error = action.payload || "Failed to update employee";
            });
    },
});

export const { setSearch, clearUsers, toggleSortOrder, setLimit, setEditEmp } = employeeSlice.actions;
export default employeeSlice.reducer;
