import {View, Text, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Fonts} from '@/constants/fonts';

export function BalanceHeader({balance}: {balance: number}) {
    return (
        <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
            <View style={styles.balanceRow}>
                <Text style={styles.balanceAmount}>{balance.toLocaleString()}</Text>
                <View style={styles.balanceStar}>
                    <MaterialCommunityIcons name="star" size={24} color="#FFF"/>
                </View>
            </View>
            <View style={styles.badgeRow}>
                <View style={styles.tierBadge}>
                    <Text style={styles.tierBadgeText}>ELITE TIER</Text>
                </View>
                <View style={styles.expiresBadge}>
                    <Text style={styles.expiresBadgeText}>EXPIRES IN 12D</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    balanceHeader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
    },
    balanceLabel: {
        color: '#464653',
        fontSize: 12,
        fontFamily: Fonts.inter.medium,
        letterSpacing: 1.2,
        marginBottom: 2,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    balanceAmount: {
        color: '#00003C',
        fontSize: 48,
        fontFamily: Fonts.manrope.extraBold,
        letterSpacing: -1.2,
    },
    balanceStar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FCD400',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    tierBadge: {
        backgroundColor: '#FFE16D',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
    },
    tierBadgeText: {
        color: '#221B00',
        fontSize: 12,
        fontFamily: Fonts.inter.semiBold,
        letterSpacing: 0.6,
    },
    expiresBadge: {
        backgroundColor: '#EAE7F0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
    },
    expiresBadgeText: {
        color: '#464653',
        fontSize: 12,
        fontFamily: Fonts.inter.semiBold,
        letterSpacing: 0.6,
    },
});
