import {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {Fonts} from '@/constants/fonts';

function PulseDot({delay}: { delay: number }) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return <Animated.View style={[styles.dot, {opacity}]}/>;
}

export function LoadingOlderEntries() {
    return (
        <View style={styles.container}>
            <View style={styles.dotsRow}>
                <PulseDot delay={0}/>
                <PulseDot delay={200}/>
                <PulseDot delay={400}/>
            </View>
            <Text style={styles.text}>LOADING OLDER ENTRIES</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 12,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00003C',
    },
    text: {
        color: '#999',
        fontSize: 11,
        fontFamily: Fonts.inter.semiBold,
        letterSpacing: 2,
    },
});