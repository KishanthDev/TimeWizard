import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "../config/axios";

export const login = createAsyncThunk("/api/login",async({credentials},{rejectWithValue})=> {
    try {
        const response = await axios.post("/api/users/login",credentials)
        localStorage.setItem("token",response.data.token)
        return response.data.user
    } catch (error) {
        console.log(error.response.data.error);
        return rejectWithValue(error.response.data.error)
    }
})

export const profile = createAsyncThunk("/api/profile",async()=>{
    const response = await axios.get("/api/users/profile",{headers:{Authorization:localStorage.getItem("token")}})
    return response.data
})

export const updateProfile = createAsyncThunk("/api/updateProfile", async (formData, {dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put("/api/users/edit", formData, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      dispatch(profile())
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data.error);
    }
  });

const userSlice = createSlice({
    name:"user",
    initialState:{user:null,isLoggedIn:false,isLoading:false,error:null},
    reducers:{
        logout(state){
            state.user = null;
            state.isLoggedIn = false;
            localStorage.removeItem("token");
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(login.pending,(state)=>{state.isLoading = true})
        .addCase(login.fulfilled,(state,action)=>{
            state.user = action.payload;
            state.isLoggedIn = true;
            state.isLoading = false;
        })
        .addCase(login.rejected,(state,action)=>{
            state.error = action.payload;
            state.isLoading = false
        })
        .addCase(profile.fulfilled,(state,action)=>{
            state.user = action.payload;
            state.isLoggedIn = true;
        })
        .addCase(updateProfile.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.user = action.payload;
            state.error = null;
            state.isLoggedIn = true;
            state.isLoading = false;
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        });
    }
})


export const {logout} = userSlice.actions
export default userSlice.reducer