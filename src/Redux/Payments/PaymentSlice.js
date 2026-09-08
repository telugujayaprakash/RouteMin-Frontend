import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/config'

// CREATE PAYMENT
export const createPayment = createAsyncThunk(
    'payment/createPayment',
    async (paymentType, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/v1/payments/order', {
                paymentType
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Unable to create payment.'
            )
        }
    }
)

// VERIFY PAYMENT
export const verifyPayment = createAsyncThunk(
    'payment/verifyPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await api.post(
                '/api/v1/payments/verify',
                paymentData
            )

            return response.data
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Payment verification failed.'
            )
        }
    }
)

//fetch invoice
export const fetchInvoices = createAsyncThunk("reports/fetchInvoices", async (_, { rejectWithValue }) => {
    try {
        // const response = await api.get(`api/v1/payments/invoices/${16}/download`);
        const response = await api.get(`api/v1/payments/invoices`);
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to fetch invoices. Please try again.'
        );
    }
});

export const downloadInvoice = createAsyncThunk(
    'reports/downloadInvoice',
    async ({ paymentId, invoiceNumber }, { rejectWithValue }) => {
        try {
            const response = await api.get(
                `api/v1/payments/invoices/${paymentId}/download`,
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
            link.download = `${invoiceNumber || 'Invoice'}.pdf`
            document.body.appendChild(link)
            link.click()
            // Cleanup
            link.remove()
            window.URL.revokeObjectURL(url)

            return {
                paymentId,
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


// INITIAL STATE
const initialState = {
    payment: null,
    isCreating: false,
    invoice: [],
    isVerifying: false,
    success: false,
    error: null
}
const PaymentSlice = createSlice({
    name: 'Payment',
    initialState,
    reducers: {
        clearPaymentError: state => {
            state.error = null
        },

        clearPayment: state => {
            state.payment = null
            state.error = null
            state.success = false
            state.isCreating = false
            state.isVerifying = false
        },

        resetPaymentStatus: state => {
            state.success = false
            state.error = null
        }
    },

    extraReducers: builder => {
        // CREATE PAYMENT
        builder
            .addCase(createPayment.pending, state => {
                state.isCreating = true
                state.error = null
                state.payment = null
            })

            .addCase(createPayment.fulfilled, (state, action) => {
                state.isCreating = false
                state.payment = action.payload
                state.error = null
            })

            .addCase(createPayment.rejected, (state, action) => {
                state.isCreating = false
                state.payment = null
                state.error = action.payload || 'Unable to create payment.'
            })

        // VERIFY PAYMENT
        builder
            .addCase(verifyPayment.pending, state => {
                state.isVerifying = true
                state.error = null
                state.success = false
            })

            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.isVerifying = false
                state.success = true
                state.error = null

                // Store verified payment response
                state.payment = action.payload
            })

            .addCase(verifyPayment.rejected, (state, action) => {
                state.isVerifying = false
                state.success = false
                state.error =
                    action.payload || 'Payment verification failed.'
            })

            //fetch invoices
            .addCase(fetchInvoices.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.invoice = action.payload;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })

            //fetch invoices
            .addCase(downloadInvoice.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(downloadInvoice.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(downloadInvoice.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ||
                    action.error.message ||
                    'Something went Wrong!'
            })
    }
})

export const {
    clearPaymentError,
    clearPayment,
    resetPaymentStatus
} = PaymentSlice.actions

export default PaymentSlice.reducer