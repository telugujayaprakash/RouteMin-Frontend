import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/config";


//Fetch Factory Slice
export const fetchfactory = createAsyncThunk("factory/fetchfactory", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/api/v1/factories")
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to fetch factories. Please try again.'
        )
    }
});

//Post Factory Slice
export const postfactory = createAsyncThunk("factory/postfactory", async (factoryData, { rejectWithValue }) => {
    try {
        const response = await api.post("api/v1/factories", factoryData);
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to create factory. Please try again.'
        )
    }
});

//Update Factory Slice
export const updatefactory = createAsyncThunk("factory/updatefactory", async ({ id, factoryData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/api/v1/factories/${id}`, factoryData);
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to update factory. Please try again.'
        )
    }
});

//Delete Factory Slice
export const deletefactory = createAsyncThunk("factory/deletefactory", async ({ id }, { rejectWithValue }) => {
    try {
        const response = await api.delete(`/api/v1/factories/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to delete factory. Please try again.'
        )
    }
});


const FactorySlice = createSlice({
    name: "Factory",
    initialState: {
        factories: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //Fetch Factories
            .addCase(fetchfactory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchfactory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.factories = action.payload;
            })
            .addCase(fetchfactory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
            //Post factory
            .addCase(postfactory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(postfactory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.factories.push(action.payload);
            })
            .addCase(postfactory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
            //Update Factory
            .addCase(updatefactory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatefactory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.factories = action.payload;
            })
            .addCase(updatefactory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
            //Delete Factory
            .addCase(deletefactory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deletefactory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.factories = action.payload;
            })
            .addCase(deletefactory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
    },
});

export default FactorySlice.reducer;