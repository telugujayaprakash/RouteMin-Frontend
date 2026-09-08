import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/config";


//Fetch Reports Slice
export const fetchreports = createAsyncThunk("reports/fetchreports", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/api/v1/reports")
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to fetch reports. Please try again.'
        );
    }
});

// Download Report by Optimization Run ID
export const downloadreportsbyId = createAsyncThunk(
  'reports/downloadreports',
  async ({ optimizationRunId, runName }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `api/v1/reports/download/run/${optimizationRunId}`,
        {
          responseType: 'blob'
        }
      )

      // Create PDF blob
      const blob = new Blob([response.data], {
        type: 'application/pdf'
      })

      // Create temporary URL
      const url = window.URL.createObjectURL(blob)

      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `${runName || 'Optimization_Report'}.pdf`

      document.body.appendChild(link)
      link.click()

      // Cleanup
      link.remove()
      window.URL.revokeObjectURL(url)

      return {
        optimizationRunId,
        success: true
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to download report. Please try again.'
      )
    }
  }
)

//Generate Reports Slice
export const generatereport = createAsyncThunk("reports/generatereport", async (optimizationRunId, { rejectWithValue }) => {
    try {
        const response = await api.post(`/api/v1/reports/generate/${optimizationRunId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to generate report. Please try again.'
        );
    }
});


//Delete Reports Slice
export const deletereports = createAsyncThunk("reports/deletereports", async (optimizationRunId, { rejectWithValue }) => {
    try {
        const response = await api.delete(`/api/v1/reports/run/${optimizationRunId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to delete report. Please try again.'
        );
    }
});


const ReportSlice = createSlice({
    name: "Reports",
    initialState: {
        reports: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //Fetch Reports
            .addCase(fetchreports.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchreports.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reports = action.payload;
            })
            .addCase(fetchreports.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
            //Download Reports
            .addCase(downloadreportsbyId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(downloadreportsbyId.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(downloadreportsbyId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
            //Generate Reports
            .addCase(generatereport.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(generatereport.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.reports.push(action.payload);
            })
            .addCase(generatereport.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
            //Delete Reports
            .addCase(deletereports.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deletereports.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reports = state.reports.filter(
                    report => report.optimizationRunId !== action.payload
                );
            })
            .addCase(deletereports.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
    },
});

export default ReportSlice.reducer;