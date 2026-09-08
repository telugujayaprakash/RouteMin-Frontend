import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/config";

// Run Optimization
export const runOptimization = createAsyncThunk("optimization/run", async (payload, { rejectWithValue }) => {
    try {
        const response = await api.post("api/v1/optimization/generate", payload)
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to run optimization. Please try again.'
        )
    }
})

// Fetch Optimization History 
export const fetchOptimizationHistory = createAsyncThunk("optimization/results", async (payload, { rejectWithValue }) => {
    try {
        const response = await api.get("api/v1/optimization", payload)
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to fetch optimization history. Please try again.'
        )
    }
})

// Fetch Single Optimization Result by ID
export const fetchOptimizationById = createAsyncThunk("optimization/fetchById", async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`api/v1/optimization/${id}`)
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to fetch optimization by ID. Please try again.'
        )
    }
})

// Fetch Optimization Matrix by Run ID
export const fetchOptimizationMatrix = createAsyncThunk("optimization/fetchMatrix", async (optimizationRunId, { rejectWithValue }) => {
    try {
        const response = await api.get(`api/v1/optimization/${optimizationRunId}/matrix`)
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to fetch optimization matrix. Please try again.'
        )
    }
})

const OptimizationSlice = createSlice({
    name: "Optimization",
    initialState: {
        result: null,
        history: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setResult: (state, action) => {
            state.result = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Run Optimization
            .addCase(runOptimization.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(runOptimization.fulfilled, (state, action) => {
                state.isLoading = false;
                state.result = action.payload;
            })
            .addCase(runOptimization.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
            // Fetch Optimization History
            .addCase(fetchOptimizationHistory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOptimizationHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.history = action.payload;
            })
            .addCase(fetchOptimizationHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
            // Fetch Optimization By Id
            .addCase(fetchOptimizationById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOptimizationById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.result = action.payload;
            })
            .addCase(fetchOptimizationById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
    },
});

export const { setResult } = OptimizationSlice.actions;
export default OptimizationSlice.reducer;