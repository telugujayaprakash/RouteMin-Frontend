import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/config'

//signup
export const signupAuth = createAsyncThunk(
    'auth/signup',
    async ({ fullname, email, phoneno, password, state }, { rejectWithValue }) => {
        try {
            const response = await api.post('api/v1/auth/register', {
                fullName: fullname,
                email: email,
                mobile: phoneno,
                password: password,
                state: state
            })

            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Signup failed. Please try again.'
            )
        }
    }
)

//login
export const loginAuth = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('api/v1/auth/login', {
                email,
                password
            })
            console.log(response.data)
            localStorage.setItem('token', response.data.token)
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Login failed. Please try again.'
            )
        }
    }
)


//fetch current user
export const fetchCurrentUser = createAsyncThunk("reports/fetchCurrentUser", async (userId, { rejectWithValue }) => {
    try {
        const response = await api.get(`api/v1/subscriptions/userme/${userId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to fetch current user. Please try again.'
        );
    }
});

// forgot password - send OTP
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await api.post('api/v1/auth/forgot-password', { email })
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to send OTP. Please try again.'
            )
        }
    }
)

// verify OTP
export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await api.post('api/v1/auth/verify-otp', { email, otp })
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Invalid or expired OTP code.'
            )
        }
    }
)

// reset password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, newPassword, confirmPassword }, { rejectWithValue }) => {
        try {
            const response = await api.post('api/v1/auth/reset-password', {
                email,
                newPassword,
                confirmPassword
            })
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to reset password. Please try again.'
            )
        }
    }
)


const AuthSlice = createSlice({
    name: 'Auth',
    initialState: {
        user: null,
        isLoggined: false,
        isLoading: false,
        error: null,
        usage: null
    },
    reducers: {
        clearError: state => {
            state.error = null
            state.isLoading = false
        },
        logout: state => {
            localStorage.removeItem('token')
            state.user = null
            state.isLoggined = false
            state.error = null
            state.usage = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(signupAuth.pending, state => {
                state.isLoading = true
                state.error = null
            })
            .addCase(signupAuth.fulfilled, (state, action) => {
                state.isLoading = false
                state.error = null
            })
            .addCase(signupAuth.rejected, (state, action) => {
                state.isLoading = false
                state.error =
                    action.payload ||
                    action.error.message ||
                    'Signup failed. Please try again.'
            })
            .addCase(loginAuth.pending, state => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginAuth.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.isLoggined = true
                state.error = null
            })
            .addCase(loginAuth.rejected, (state, action) => {
                state.isLoading = false
                state.error =
                    action.payload ||
                    action.error.message ||
                    'Login failed. Please try again.'
            })
            .addCase(fetchCurrentUser.pending, state => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.isLoggined = true
                state.error = null
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.isLoading = false
                state.error =
                    action.payload ||
                    action.error.message ||
                    'Failed to fetch current user. Please try again.'
            })
            .addCase(forgotPassword.pending, state => {
                state.isLoading = true
                state.error = null
            })
            .addCase(forgotPassword.fulfilled, state => {
                state.isLoading = false
                state.error = null
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(verifyOtp.pending, state => {
                state.isLoading = true
                state.error = null
            })
            .addCase(verifyOtp.fulfilled, state => {
                state.isLoading = false
                state.error = null
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(resetPassword.pending, state => {
                state.isLoading = true
                state.error = null
            })
            .addCase(resetPassword.fulfilled, state => {
                state.isLoading = false
                state.error = null
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export const { logout, clearError } = AuthSlice.actions
export default AuthSlice.reducer