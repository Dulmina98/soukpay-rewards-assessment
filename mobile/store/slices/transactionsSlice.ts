import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetTransactions } from '@/services/api';

interface Transaction {
    id: string;
    user_id: string;
    delta: number;
    reason: string;
    created_at: string;
}

interface TransactionsState {
    items: Transaction[];
    page: number;
    hasMore: boolean;
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
}

const initialState: TransactionsState = {
    items: [],
    page: 1,
    hasMore: true,
    isLoading: false,
    isRefreshing: false,
    error: null,
};

export const fetchTransactions = createAsyncThunk(
    'transactions/fetch',
    async (page: number, { rejectWithValue }) => {
        try {
            return await apiGetTransactions(page, 20);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        resetTransactions: (state) => {
            state.items = [];
            state.page = 1;
            state.hasMore = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state, action) => {
                if (action.meta.arg === 1) {
                    state.isRefreshing = true;
                } else {
                    state.isLoading = true;
                }
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isRefreshing = false;
                const { data, pagination } = action.payload;

                if (pagination.page === 1) {
                    state.items = data;         // Replace on refresh
                } else {
                    state.items = [...state.items, ...data];
                }

                state.page = pagination.page;
                state.hasMore = pagination.hasMore;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.isRefreshing = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;