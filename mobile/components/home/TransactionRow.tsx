import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts } from '@/constants/fonts';

const getIconConfig = (reason: string, delta: number): { name: any } => {
    const r = reason.toLowerCase();
    if (delta < 0) return { name: 'gift-outline' };
    if (r.includes('flight') || r.includes('airway')) return { name: 'airplane' };
    if (r.includes('dining') || r.includes('bistro') || r.includes('food')) return { name: 'silverware-fork-knife' };
    if (r.includes('referral')) return { name: 'account-plus-outline' };
    if (r.includes('ride') || r.includes('travel') || r.includes('bolt')) return { name: 'car-outline' };
    if (r.includes('login') || r.includes('streak')) return { name: 'lightning-bolt' };
    if (r.includes('social') || r.includes('share')) return { name: 'share-variant-outline' };
    if (r.includes('purchase') || r.includes('reward')) return { name: 'shopping-outline' };
    return { name: 'star-circle-outline' };
};

const getCategory = (reason: string, delta: number): string => {
    if (delta < 0) return 'REDEMPTION';
    const r = reason.toLowerCase();
    if (r.includes('referral')) return 'REWARD';
    if (r.includes('ride') || r.includes('travel')) return 'TRAVEL';
    if (r.includes('dining') || r.includes('bistro')) return 'DINING';
    if (r.includes('login') || r.includes('streak')) return 'STREAK';
    if (r.includes('social') || r.includes('share')) return 'SOCIAL';
    return 'PURCHASE';
};

export function TransactionRow({ item }: { item: any }) {
    const isEarn = item.delta > 0;
    const date = new Date(item.created_at);
    const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    const { name } = getIconConfig(item.reason, item.delta);

    return (
        <View style={styles.txRow}>
            <View style={styles.txIconBox}>
                <MaterialCommunityIcons name={name} size={26} color="#3D3A50" />
            </View>
            <View style={styles.txLeft}>
                <Text style={styles.txReason} numberOfLines={1}>{item.reason}</Text>
                <Text style={styles.txMeta}>{formatted} • {getCategory(item.reason, item.delta)}</Text>
            </View>
            <View style={styles.txRight}>
                <Text style={[styles.txDelta, isEarn ? styles.earn : styles.redeem]}>
                    {isEarn ? '+' : ''}{item.delta.toLocaleString()}
                </Text>
                <Text style={styles.txPtsLabel}>POINTS</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    txRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
    },
    txIconBox: {
        width: 60,
        height: 60,
        borderRadius: 14,
        backgroundColor: '#F0EFF5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    txLeft: {
        flex: 1,
        marginRight: 12,
    },
    txReason: {
        color: '#1B1B22',
        fontSize: 16,
        fontFamily: Fonts.manrope.bold,
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    txMeta: {
        color: '#999',
        fontSize: 11,
        fontFamily: Fonts.inter.semiBold,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    txRight: {
        alignItems: 'flex-end',
    },
    txDelta: {
        fontSize: 18,
        fontFamily: Fonts.manrope.extraBold,
        letterSpacing: -0.5,
    },
    txPtsLabel: {
        color: '#999',
        fontSize: 11,
        fontFamily: Fonts.inter.semiBold,
        letterSpacing: 0.5,
        marginTop: 2,
    },
    earn: {
        color: '#00003C',
    },
    redeem: {
        color: '#f87171',
    },
});
