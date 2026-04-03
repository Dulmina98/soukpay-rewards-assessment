import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/fonts';
import BellIcon from '@/assets/icons/header/bell.svg';

type HeaderProps = {
    showWelcome?: boolean;
};

export function Header({ showWelcome = false }: HeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>S</Text>
                </View>
                <View>
                    {showWelcome && (
                        <Text style={styles.welcome}>Welcome back</Text>
                    )}
                    <Text style={styles.title}>The Vault</Text>
                </View>
            </View>
            <TouchableOpacity activeOpacity={0.6} style={styles.bellBtn}>
                <BellIcon width={16} height={20} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#FFF',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#00003C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FCD400',
        fontSize: 16,
        fontFamily: Fonts.manrope.bold,
    },
    welcome: {
        color: '#888',
        fontSize: 10,
        fontFamily: Fonts.inter.semiBold,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    title: {
        color: '#00003C',
        fontSize: 18,
        fontFamily: Fonts.manrope.extraBold,
        letterSpacing: -0.4,
    },
    bellBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
