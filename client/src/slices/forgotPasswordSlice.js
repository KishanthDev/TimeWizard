// resetPasswordSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../config/axios"

export const sendForgotPasswordEmail = createAsyncThunk(
  'resetPassword/sendForgotPasswordEmail',
  async (email) => {
    const response = await axios.post('/api/users/forgotPassword', { email });
    return response.data;
  }
);

export const verifyOtpAndResetPassword = createAsyncThunk(
  'resetPassword/verifyOtpAndResetPassword',
  async ({ email, otp, newPassword }) => {
    const response = await axios.post('/api/verifyOtpAndResetPassword', { email, otp, newPassword })
    return response.data;
  }
);

export const resetPasswordWithOldPassword = createAsyncThunk(
  "resetPassword/resetPasswordWithOldPassword",
  async ({ email, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/users/resetPassword", {
        email,
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Password reset failed");
    }
  }
);

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState: { isLoading: null,success:false,error:null },
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendForgotPasswordEmail.pending, (state) => { state.isLoading = true })
      .addCase(sendForgotPasswordEmail.fulfilled, (state) => { state.isLoading = false })

      .addCase(verifyOtpAndResetPassword.pending, (state) => { state.isLoading = true })
      .addCase(verifyOtpAndResetPassword.fulfilled, (state) => { state.isLoading = true })

      .addCase(resetPasswordWithOldPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordWithOldPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(resetPasswordWithOldPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {resetState} = resetPasswordSlice.actions
export default resetPasswordSlice.reducer;
