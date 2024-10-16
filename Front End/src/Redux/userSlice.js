import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// Initial state with token decoding if available
const token = localStorage.getItem('authToken');
let user = null;

if (token) {
    try {
        const decodedToken = jwtDecode(token);
        user = {
            id: decodedToken.id, // Adjust based on token structure
            username: decodedToken.username,
            email: decodedToken.email,
        };
    } catch (error) {
        console.error('Failed to decode token:', error);
    }
}

// Thunk for registering a new user
export const registerUser = createAsyncThunk('user/registerUser', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3000/api/user/signup', data, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response ? error.response.data : 'An unknown error occurred');
    }
});

// Thunk for verifying OTP
export const verifyOTP = createAsyncThunk('user/verifyOTP', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3000/api/user/verifyOTP', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response ? error.response.data : 'An unknown error occurred');
    }
});

// Thunk for resending OTP
export const resentOTP = createAsyncThunk('user/resendOTP', async (data, { rejectWithValue }) => {
    try {

        const response = await axios.post('http://localhost:3000/api/user/resendOTP', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        })
        return response.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response ? error.response.data : 'An unknown error occurred');
    }
})

// Thunk for login user
export const loginUser = createAsyncThunk('user/loginUser', async (data, { rejectWithValue }) => {
    try {

        const response = await axios.post('http://localhost:3000/api/user/login', data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })
        return response.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response ? error.response.data : 'An unknown error occurred');
    }
})

// Thunk for logout user
export const logoutUser = createAsyncThunk('user/logoutUser', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3000/api/user/logout', {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        return response.data?.message || "Logout successful";
    } catch (error) {
        console.log('Logout error:', error);
        return rejectWithValue(
            error.response?.data || { message: 'An unknown error occurred' }
        );
    }
});



const initialState = {
    user,
    isLoading: false,
    error: null,
    successMessage: null
};

// Create user slice
const userSlice = createSlice({
    name: 'user',
    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },

    },

    extraReducers: (builder) => {
        builder

            //register user
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;

                // Store token and decode user data
                if (action.payload.token) {
                    const token = action.payload.token;
                    localStorage.setItem('authToken', token);

                    // Decode the token to get user details
                    const decodedToken = jwtDecode(token);
                    state.user = {
                        id: decodedToken.id,
                        username: decodedToken.username,
                        email: decodedToken.email,
                    };
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || "Registration Failed";
            })

            // User Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;

                // Update user state based on the response if needed
                // For example, if the server returns updated user info after verification
                state.user = {
                    ...state.user,
                    isVerified: true, // Example: Add a field to indicate the user has verified the OTP
                };
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || "Verification Failed";
            })

            //  Resend OTP
            .addCase(resentOTP.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(resentOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(resentOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || "Resend OTP Failed";
            })

            // login user
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;

                if (action.payload.token) {
                    const token = action.payload.token;
                    localStorage.setItem('authToken', token);

                    // Decode token to update user state
                    const decodedToken = jwtDecode(token);
                    state.user = {
                        id: decodedToken.id,
                        username: decodedToken.username,
                        email: decodedToken.email,
                    };
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || 'Login Failed';
                console.error('Login error:', action.payload);
            })


            // logout user
            .addCase(logoutUser.pending, async (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.error = null;
                localStorage.removeItem('authToken');
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || action.error?.message || 'Logout Failed';
            })
    }
});


// Export actions and reducer
export const { clearError, clearSuccessMessage, logout } = userSlice.actions;
export default userSlice.reducer;
