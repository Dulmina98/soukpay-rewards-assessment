import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { apiLogin } from '@/services/api';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isInitialized: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    isInitialized: false,
    error: null,
};

// Async action — login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (
        credentials: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const data = await apiLogin(credentials.email, credentials.password);

            // Store token securely on device
            await SecureStore.setItemAsync('token', data.token);
            await SecureStore.setItemAsync('tokenExpiry',
                String(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            );

            return data; // { token, user }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

// Async action — check stored token on app launch
export const loadStoredAuth = createAsyncThunk(
    'auth/loadStored',
    async (_, { rejectWithValue }) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const expiry = await SecureStore.getItemAsync('tokenExpiry');

            if (!token || !expiry) return null;

            // Check if token is expired
            if (Date.now() > parseInt(expiry)) {
                await SecureStore.deleteItemAsync('token');
                await SecureStore.deleteItemAsync('tokenExpiry');
                return null;
            }

            return token;
        } catch {
            return rejectWithValue('Failed to load auth');
        }
    }
);

// Async action — logout
export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('tokenExpiry');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        // loginUser
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // loadStoredAuth
        builder
            .addCase(loadStoredAuth.fulfilled, (state, action) => {
                if (action.payload) {
                    state.token = action.payload;
                    state.isAuthenticated = true;
                }
                state.isInitialized = true;
            })
            .addCase(loadStoredAuth.rejected, (state) => {
                state.isInitialized = true;
            });

        builder.addCase('user/fetchProfile/rejected', (state, action: any) => {
            const msg: string = action.payload ?? '';
            if (msg.includes('User not found') || msg.includes('Invalid') || msg.includes('401')) {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            }
        });

        // logoutUser
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;