import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/config";

// Fetch Audit Logs
export const fetchAuditLogs = createAsyncThunk("audit-logs/fetch", async () => {
    const response = await api.get("api/v1/auditlogs")
    return response.data
})


const AuditSlice = createSlice({
    name: "AuditLogs",
    initialState: {
        logs: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Audit Logs
            .addCase(fetchAuditLogs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAuditLogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logs = action.payload;
            })
            .addCase(fetchAuditLogs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
    },
});

export default AuditSlice.reducer;