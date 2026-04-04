import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts } from '@/constants/fonts';

export function UpdatingLedger() {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const anim = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        anim.start();
        return () => anim.stop();
    }, []);

    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.updatingRow}>
            <Animated.View style={{ transform: [{ rotate }] }}>
                <MaterialCommunityIcons name="refresh" size={13} color="#767684" />
            </Animated.View>
            <Text style={styles.updatingText}>UPDATING LEDGER</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    updatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
    },
    updatingText: {
        color: '#767684',
        fontSize: 12,
        fontFamily: Fonts.inter.regular,
        letterSpacing: 1.2,
    },
});
