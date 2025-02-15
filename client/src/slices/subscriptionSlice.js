import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

// 1️⃣ Create a checkout session (redirects user to Stripe)
export const createCheckoutSession = createAsyncThunk(
    "subscription/createCheckoutSession",
    async (planValue, { rejectWithValue }) => {
        try {
            const { data } = await axios.post("/api/payments/subscribe", { plan: planValue }, {
                headers: { Authorization: localStorage.getItem("token") }
            });
            return data; // Stripe session URL
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create checkout session");
        }
    }
);

// 2️⃣ Handle Stripe Checkout Success (Fetch updated plan)
export const checkoutSuccess = createAsyncThunk(
    "subscription/checkoutSuccess",
    async (_,{ rejectWithValue }) => {
        try { 
            const { data } = await axios.get("/api/payments/success",{
                headers: { Authorization: localStorage.getItem("token") }
            });
            return data; // Updated subscription details
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to verify subscription");
        }
    }
);

// 3️⃣ Fetch the user's subscription status
export const fetchSubscriptionStatus = createAsyncThunk(
    "subscription/fetchSubscriptionStatus",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/payments/subscribe", {
                headers: { Authorization: localStorage.getItem("token") }
            });
            return data; // Subscription details
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch subscription status");
        }
    }
);

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState: {
        plan: "free", // Default plan
        isLoading: false,
        sessionUrl: null,
        error: null,
        status: "active", // Subscription status (active/canceled)
    },
    reducers: {
        setSubscription: (state, action) => {
            state.plan = action.payload.plan;
            state.status = action.payload.status;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCheckoutSession.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCheckoutSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessionUrl = action.payload.sessionUrl;
            })
            .addCase(createCheckoutSession.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(checkoutSuccess.fulfilled, (state, action) => {
                state.plan = action.payload.plan;
                state.status = action.payload.status;
            })
            .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
                state.plan = action.payload.plan;
                state.status = action.payload.status;
            });
    },
});

export const { setSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
