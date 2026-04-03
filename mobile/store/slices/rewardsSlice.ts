import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetRewards, apiRedeemReward } from '@/services/api';

interface Reward {
    id: string;
    name: string;
    description: string;
    image_url: string | null;
    points_cost: number;
    stock_remaining: number;
    is_active: boolean;
}

interface RewardsState {
    rewards: Reward[];
    isLoading: boolean;
    isRedeeming: boolean;
    error: string | null;
    redeemError: string | null;
    lastRedeemedId: string | null;
}

const initialState: RewardsState = {
    rewards: [],
    isLoading: false,
    isRedeeming: false,
    error: null,
    redeemError: null,
    lastRedeemedId: null,
};

export const fetchRewards = createAsyncThunk(
    'rewards/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await apiGetRewards();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const redeemReward = createAsyncThunk(
    'rewards/redeem',
    async (
        { rewardId, idempotencyKey }: { rewardId: string; idempotencyKey: string },
        { rejectWithValue }
    ) => {
        try {
            return await apiRedeemReward(rewardId, idempotencyKey);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const rewardsSlice = createSlice({
    name: 'rewards',
    initialState,
    reducers: {
        clearRedeemError: (state) => {
            state.redeemError = null;
        },
        clearLastRedeemed: (state) => {
            state.lastRedeemedId = null;
        },
        // decrement stock immediately
        decrementStock: (state, action: { payload: string }) => {
            const reward = state.rewards.find((r) => r.id === action.payload);
            if (reward) reward.stock_remaining -= 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRewards.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRewards.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rewards = action.payload;
            })
            .addCase(fetchRewards.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(redeemReward.pending, (state) => {
                state.isRedeeming = true;
                state.redeemError = null;
            })
            .addCase(redeemReward.fulfilled, (state, action) => {
                state.isRedeeming = false;
                state.lastRedeemedId = action.payload.redemption.reward_id;
            })
            .addCase(redeemReward.rejected, (state, action) => {
                state.isRedeeming = false;
                state.redeemError = action.payload as string;
            });
    },
});

export const { clearRedeemError, clearLastRedeemed, decrementStock } =
    rewardsSlice.actions;
export default rewardsSlice.reducer;