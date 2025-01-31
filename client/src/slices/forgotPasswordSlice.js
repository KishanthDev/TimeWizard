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

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState: { isLoading: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendForgotPasswordEmail.pending, (state) => { state.isLoading = true })
      .addCase(sendForgotPasswordEmail.fulfilled, (state) => { state.isLoading = false })

      .addCase(verifyOtpAndResetPassword.pending, (state) => { state.isLoading = true })
      .addCase(verifyOtpAndResetPassword.fulfilled, (state) => { state.isLoading = true })
  },
});

export default resetPasswordSlice.reducer;
