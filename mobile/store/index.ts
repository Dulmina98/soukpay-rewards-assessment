import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import rewardsReducer from './slices/rewardsSlice';
import transactionsReducer from './slices/transactionsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        rewards: rewardsReducer,
        transactions: transactionsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;