import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export function OfflineBanner({ isOnline }: { isOnline: boolean }) {
    const slideAnim = useRef(new Animated.Value(-60)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isOnline ? -60 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOnline]);

    return (
        <Animated.View
            style={[
                styles.banner,
                { transform: [{ translateY: slideAnim }] }
            ]}
        >
            <Text style={styles.text}>⚠️  No internet connection</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ef4444',
        paddingVertical: 10,
        paddingHorizontal: 16,
        zIndex: 999,
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
});