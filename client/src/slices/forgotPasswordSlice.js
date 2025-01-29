// resetPasswordSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../config/axios"

// Async thunk for sending forgot password email
export const sendForgotPasswordEmail = createAsyncThunk(
  'resetPassword/sendForgotPasswordEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users/forgotPassword', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for verifying OTP and resetting password
export const verifyOtpAndResetPassword = createAsyncThunk(
  'resetPassword/verifyOtpAndResetPassword',
  async ({email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/verifyOtpAndResetPassword', { email,otp, newPassword })
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error||"reset password error");
    }
  }
);

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState: {
    error: null,
    isLoading:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendForgotPasswordEmail.pending, (state) => {
        state.isLoading = true
      })
      .addCase(sendForgotPasswordEmail.fulfilled, (state, action) => {
        state.status = false
      })
      .addCase(sendForgotPasswordEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload;
      })
      .addCase(verifyOtpAndResetPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(verifyOtpAndResetPassword.fulfilled, (state, action) => {
        state.isLoading = true
      })
      .addCase(verifyOtpAndResetPassword.rejected, (state, action) => {
        state.isLoading = true
        state.error = action.payload;
      });
  },
});

export default resetPasswordSlice.reducer;
