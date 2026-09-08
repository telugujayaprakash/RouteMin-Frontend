import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/config";


//Post Warehouse Slice
export const postwarehouse = createAsyncThunk("warehouse/postwarehouse", async (warehouseData,{rejectWithValue}) => {
    try {
        const response = await api.post("api/v1/warehouses", warehouseData);
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to create warehouse. Please try again.'
        );
    }
});

//Fetch Warehouse Slice
export const fetchwarehouse = createAsyncThunk("warehouse/fetchwarehouse", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("api/v1/warehouses");
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to fetch warehouses. Please try again.'
        );
    }
});

//Update Warehouse Slice
export const updatewarehouse = createAsyncThunk("warehouse/updatewarehouse", async ({ id, warehouseData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/api/v1/warehouses/${id}`, warehouseData);
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to update warehouse. Please try again.'
        );
    }
});

//Delete Warehouse Slice
export const deletewarehouse = createAsyncThunk("warehouse/deletewarehouse", async ({ id }, { rejectWithValue }) => {
    try {
        const response = await api.delete(`/api/v1/warehouses/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to delete warehouse. Please try again.'
        );
    }
});


const WarehouseSlice = createSlice({
    name: "Warehouse",
    initialState: {
        warehouses: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //Signup
            .addCase(postwarehouse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(postwarehouse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.warehouses.push(action.payload);
            })
            .addCase(postwarehouse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })

            //Fetch Warehouses
            .addCase(fetchwarehouse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchwarehouse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.warehouses = action.payload;
            })
            .addCase(fetchwarehouse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
            //Update Warehouses
            .addCase(updatewarehouse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatewarehouse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.warehouses = action.payload;
            })
            .addCase(updatewarehouse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            //Delete Warehouses
            .addCase(deletewarehouse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deletewarehouse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.warehouses = action.payload;
            })
            .addCase(deletewarehouse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!';
            })
    },
});


export default WarehouseSlice.reducer;