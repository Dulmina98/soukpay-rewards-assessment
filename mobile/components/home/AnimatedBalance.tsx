import { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/fonts';

export function AnimatedBalance({ balance }: { balance: number }) {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayed, setDisplayed] = useState(0);

    useEffect(() => {
        animatedValue.setValue(0);
        Animated.timing(animatedValue, {
            toValue: balance,
            duration: 1200,
            useNativeDriver: false,
        }).start();

        const listener = animatedValue.addListener(({ value }) => {
            setDisplayed(Math.floor(value));
        });

        return () => animatedValue.removeListener(listener);
    }, [balance]);

    return (
        <Text style={styles.balanceAmount}>{displayed.toLocaleString()}</Text>
    );
}

const styles = StyleSheet.create({
    balanceAmount: {
        color: '#fff',
        fontSize: 48,
        fontFamily: Fonts.manrope.extraBold,
        letterSpacing: -2.4,
    },
});
