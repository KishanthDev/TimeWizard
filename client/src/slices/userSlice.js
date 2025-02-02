import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../config/axios";

export const login = createAsyncThunk("/api/login", async ({ credentials, navigate }) => {
    const response = await axios.post("/api/users/login", credentials)
    localStorage.setItem("token", response.data.token)
    if (response.data.user.role === "admin") {
        navigate("/admin");
    } else if (response.data.user.role === "employee") {
        navigate("/employee");
    }
    return response.data.user
})

export const profile = createAsyncThunk("/api/profile", async () => {
    const response = await axios.get("/api/users/profile", { headers: { Authorization: localStorage.getItem("token") } })
    return response.data
})

export const fetchEmployees = createAsyncThunk("/api/employees",async () => {
    const response = await axios.get("/api/users/get",{headers:{Authorization:localStorage.getItem("token")}})
    return response.data.users
})

export const updateProfile = createAsyncThunk("/api/updateProfile", async (formData, { dispatch }) => {
    const response = await axios.put("/api/users/edit", formData, {
        headers: { Authorization: localStorage.getItem("token") },
    });
    dispatch(profile())
    return response.data;
});

const userSlice = createSlice({
    name: "user",
    initialState: { user: null, isLoggedIn: false, isLoading: false ,employees:[]},
    reducers: {
        logout(state) {
            state.user = null;
            state.isLoggedIn = false;
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => { state.isLoading = true })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoggedIn = true;
                state.isLoading = false;
            })
            .addCase(login.rejected,(state)=>{state.isLoading = false})
            .addCase(profile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoggedIn = true;
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoggedIn = true;
                state.isLoading = false;
            })
            .addCase(fetchEmployees.fulfilled,(state,action)=>{
                state.employees = action.payload
            })
    }
})


export const { logout } = userSlice.actions
export default userSlice.reducer