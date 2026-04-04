import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetMe, apiGetTransactions } from '@/services/api';
import * as SecureStore from 'expo-secure-store';

interface Transaction {
    id: string;
    user_id: string;
    delta: number;
    reason: string;
    created_at: string;
}

interface UserState {
    name: string;
    email: string;
    balance: number;
    recentTransactions: Transaction[];
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    name: '',
    email: '',
    balance: 0,
    recentTransactions: [],
    isLoading: false,
    error: null,
};

export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            return await apiGetMe();
        } catch (error: any) {
            if (error.message === 'User not found' || error.message?.includes('401') || error.message?.includes('Invalid')) {
                await SecureStore.deleteItemAsync('token');
                await SecureStore.deleteItemAsync('tokenExpiry');
            }
            return rejectWithValue(error.message);
        }
    }
);

export const fetchRecentTransactions = createAsyncThunk(
    'user/fetchRecent',
    async (_, { rejectWithValue }) => {
        try {
            const result = await apiGetTransactions(1, 5);
            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Updates the balance immediately after a redeem.
        deductBalance: (state, action: { payload: number }) => {
            state.balance -= action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.name = action.payload.name;
                state.email = action.payload.email;
                state.balance = action.payload.balance;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchRecentTransactions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.recentTransactions = action.payload;
            })
            .addCase(fetchRecentTransactions.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { deductBalance } = userSlice.actions;
export default userSlice.reducer;