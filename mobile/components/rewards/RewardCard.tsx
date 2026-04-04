import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import {Fonts} from '@/constants/fonts';
import type {Reward} from '@/store/slices/rewardsSlice';

export function RewardCard({item, userBalance, onPress, isOnline}: {
    item: Reward;
    userBalance: number;
    onPress: (reward: Reward) => void;
    isOnline: boolean;
}) {
    const canAfford = userBalance >= item.points_cost;
    const canRedeem = canAfford && isOnline;

    return (
        <TouchableOpacity
            style={[styles.card, !canRedeem && styles.cardDisabled]}
            onPress={() => canRedeem && onPress(item)}
            activeOpacity={canRedeem ? 0.85 : 1}
        >
            {!canRedeem && <View style={styles.cardDisabledTint}/>}
            <View style={styles.cardImageWrapper}>
                {item.image_url ? (
                    <Image
                        source={{uri: item.image_url}}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.cardImageBox, styles.cardImage]}>
                        <MaterialCommunityIcons name="gift-outline" size={48} color="#666"/>
                    </View>
                )}

                {!canRedeem && (
                    <>
                        <BlurView
                            intensity={18}
                            tint="light"
                            style={[StyleSheet.absoluteFill]}
                        />
                        <View style={styles.lockBadge}>
                            <MaterialCommunityIcons name="lock-outline" size={14} color="#00003C"/>
                            <Text style={styles.lockBadgeText}>
                                {!isOnline ? 'YOU ARE OFFLINE' : 'INSUFFICIENT POINTS'}
                            </Text>
                        </View>
                    </>
                )}
            </View>

            <View style={styles.cardBody}>
                <View style={styles.cardNameRow}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <View style={styles.stockBadge}>
                        <Text style={styles.stockBadgeText}>
                            {item.stock_remaining} LEFT
                        </Text>
                    </View>
                </View>

                <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.description}
                </Text>

                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.costLabel}>COST</Text>
                        <Text style={styles.costValue}>
                            {item.points_cost.toLocaleString()} pts
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.claimBtn, !canRedeem && styles.claimBtnDisabled]}
                        onPress={() => canRedeem && onPress(item)}
                        disabled={!canRedeem}
                        activeOpacity={0.85}
                    >
                        <Text style={[styles.claimBtnText, !canRedeem && styles.claimBtnTextDisabled]}>
                            {!isOnline ? 'Offline' : canAfford ? 'Claim Now' : 'Locked'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 16,
        overflow: 'hidden',
        position: "relative"
    },
    cardDisabled: {
        opacity: 0.85,
    },
    cardDisabledTint: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: 'rgba(198,197,213,0.8)',
        zIndex: 10,
    },
    cardImageWrapper: {
        width: '100%',
        height: 256,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: 256,
    },
    cardImageBox: {
        backgroundColor: '#ECEAF4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockBadge: {
        position: 'absolute',
        bottom: '2%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.92)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        zIndex: 20,
    },
    lockBadgeText: {
        color: '#00003C',
        fontSize: 12,
        fontFamily: Fonts.inter.semiBold,
        letterSpacing: 1,
    },
    cardBody: {
        padding: 24,
    },
    cardNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardName: {
        color: '#00003C',
        fontSize: 20,
        fontFamily: Fonts.manrope.bold,
    },
    stockBadge: {
        backgroundColor: 'rgba(252,212,0,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    stockBadgeText: {
        color: '#705D00',
        fontSize: 12,
        fontFamily: Fonts.inter.semiBold,
    },
    cardDesc: {
        color: '#464653',
        fontSize: 14,
        fontFamily: Fonts.inter.regular,
        lineHeight: 20,
        marginBottom: 20,
        marginTop: 5,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    costLabel: {
        color: '#767684',
        fontSize: 12,
        fontFamily: Fonts.inter.regular,
        letterSpacing: 0.6,
        marginBottom: 2,
    },
    costValue: {
        color: '#00003C',
        fontSize: 18,
        fontFamily: Fonts.manrope.extraBold,
    },
    claimBtn: {
        backgroundColor: '#00003C',
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 999,
    },
    claimBtnDisabled: {
        backgroundColor: '#ECEAF4',
    },
    claimBtnText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: Fonts.inter.semiBold,
    },
    claimBtnTextDisabled: {
        color: '#aaa',
    },
});
