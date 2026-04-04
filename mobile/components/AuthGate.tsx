import { useEffect } from 'react';
import { Redirect, Slot, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadStoredAuth } from '../store/slices/authSlice';

export function AuthGate() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
    const segments = useSegments();

    useEffect(() => {
        dispatch(loadStoredAuth());
    }, []);

    // Wait for stored token check to complete before deciding where to send the user
    if (!isInitialized) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a1a' }}>
                <ActivityIndicator color="#6c47ff" />
            </View>
        );
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
        return <Redirect href="/(auth)/login" />;
    }

    if (isAuthenticated && inAuthGroup) {
        return <Redirect href="/(tabs)" />;
    }

    return <Slot />;
}