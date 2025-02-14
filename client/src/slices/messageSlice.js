import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

// Async Thunk to Fetch Messages
export const fetchMessages = createAsyncThunk("messages/fetchMessages", async (projectId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/messages/project/${projectId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


export const getGeneralMessages = createAsyncThunk("messages/getGeneralMessages", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/messages/chats`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const sendMessageToServer = createAsyncThunk(
    "messages/sendMessage",
    async ({ projectId, message }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/messages/project/${projectId}`, message);
            return response.data; // Return saved message from the database
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const messageSlice = createSlice({
    name: "messages",
    initialState: {
        messages: [],
        chats:[],
        isLoading: false,
        error: null,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload); // Add new message to state
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages = action.payload; // Store fetched messages
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(sendMessageToServer.fulfilled, (state, action) => {
                state.messages.push(action.payload); // Add only after saving to DB
            })
            .addCase(getGeneralMessages.fulfilled,(state,action)=>{
                state.chats=action.payload
            })
    },
});

export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;
