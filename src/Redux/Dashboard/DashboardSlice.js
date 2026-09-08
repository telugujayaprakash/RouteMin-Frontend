import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import api from "../../api/config";


//Fetch Dashboard Slice
export const fetchDashboard = createAsyncThunk("dashboard/fetchDashboard", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("api/v1/dashboard");
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to fetch dashboard data. Please try again.'
        )
    }
});


const dashboardSlice = createSlice({
    name: "Dashboard",
    initialState: {
        Data: null,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //Fetch Dashboard
            .addCase(fetchDashboard.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.Data = action.payload;
                state.error = null
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
    },
});


export default dashboardSlice.reducer;