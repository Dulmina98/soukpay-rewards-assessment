import { useEffect } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthGate } from '@/components/AuthGate';
import { OfflineBanner } from '@/components/OfflineBanner';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';

SplashScreen.preventAutoHideAsync();

function AppWithOffline() {
    const isOnline = useNetworkStatus();

    return (
        <View style={{ flex: 1 }}>
            <OfflineBanner isOnline={isOnline} />
            <AuthGate />
        </View>
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Manrope_400Regular,
        Manrope_500Medium,
        Manrope_600SemiBold,
        Manrope_700Bold,
        Manrope_800ExtraBold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <Provider store={store}>
            <AppWithOffline />
        </Provider>
    );
}