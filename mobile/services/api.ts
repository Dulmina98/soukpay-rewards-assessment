import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// Request interceptor — automatically adds JWT to every request
apiClient.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — handle 401s globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.error ||
            error.message ||
            'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

// API functions
export const apiLogin = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data; // { token, user }
};

export const apiGetMe = async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
};

export const apiGetTransactions = async (page = 1, limit = 20) => {
    const response = await apiClient.get(
        `/users/me/transactions?page=${page}&limit=${limit}`
    );
    return response.data;
};

export const apiGetRewards = async () => {
    const response = await apiClient.get('/rewards');
    return response.data;
};

export const apiRedeemReward = async (rewardId: string, idempotencyKey: string) => {
    const response = await apiClient.post(
        `/rewards/${rewardId}/redeem`,
        {},
        { headers: { 'X-Idempotency-Key': idempotencyKey } }
    );
    return response.data;
};