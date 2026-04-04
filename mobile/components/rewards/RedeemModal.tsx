import {View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Fonts} from '@/constants/fonts';
import type {Reward} from '@/store/slices/rewardsSlice';

export function RedeemModal({reward, visible, isRedeeming, error, onConfirm, onClose}: {
    reward: Reward | null;
    visible: boolean;
    isRedeeming: boolean;
    error: string | null;
    onConfirm: () => void;
    onClose: () => void;
}) {
    if (!reward) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity activeOpacity={1} onPress={() => {}}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHandle}/>

                        <Text style={styles.modalEyebrow}>CONFIRM REDEMPTION</Text>
                        <Text style={styles.modalRewardName}>{reward.name}</Text>
                        <Text style={styles.modalDesc}>{reward.description}</Text>

                        <View style={styles.modalCostRow}>
                            <View>
                                <Text style={styles.modalCostLabel}>Points required</Text>
                                <Text style={styles.modalCostValue}>
                                    {reward.points_cost.toLocaleString()} pts
                                </Text>
                            </View>
                            <View style={styles.modalCostIconCircle}>
                                <MaterialCommunityIcons name="gift-outline" size={24} color="#00003C"/>
                            </View>
                        </View>

                        {error ? <Text style={styles.modalError}>{error}</Text> : null}

                        <TouchableOpacity
                            style={[styles.confirmBtn, isRedeeming && styles.confirmBtnDisabled]}
                            onPress={onConfirm}
                            disabled={isRedeeming}
                        >
                            {isRedeeming ? (
                                <ActivityIndicator color="#00003C"/>
                            ) : (
                                <Text style={styles.confirmBtnText}>Confirm Redeem</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={onClose}
                            disabled={isRedeeming}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 28,
        paddingBottom: 48,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E4E3F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 28,
    },
    modalEyebrow: {
        color: '#aaa',
        fontSize: 11,
        fontFamily: Fonts.inter.semiBold,
        letterSpacing: 1.6,
        marginBottom: 8,
    },
    modalRewardName: {
        color: '#1B1B22',
        fontSize: 26,
        fontFamily: Fonts.manrope.extraBold,
        letterSpacing: -0.6,
        marginBottom: 8,
    },
    modalDesc: {
        color: '#888',
        fontSize: 14,
        fontFamily: Fonts.inter.medium,
        lineHeight: 20,
        marginBottom: 24,
    },
    modalCostRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F4FB',
        borderRadius: 16,
        padding: 18,
        marginBottom: 24,
    },
    modalCostLabel: {
        color: '#aaa',
        fontSize: 12,
        fontFamily: Fonts.inter.medium,
        marginBottom: 4,
    },
    modalCostValue: {
        color: '#00003C',
        fontSize: 20,
        fontFamily: Fonts.manrope.extraBold,
        letterSpacing: -0.4,
    },
    modalCostIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFE16D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalError: {
        color: '#f87171',
        textAlign: 'center',
        fontFamily: Fonts.inter.medium,
        fontSize: 13,
        marginBottom: 16,
    },
    confirmBtn: {
        backgroundColor: '#FFE16D',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginBottom: 12,
    },
    confirmBtnDisabled: {
        opacity: 0.6,
    },
    confirmBtnText: {
        color: '#00003C',
        fontSize: 16,
        fontFamily: Fonts.manrope.extraBold,
    },
    cancelBtn: {
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#aaa',
        fontSize: 15,
        fontFamily: Fonts.inter.medium,
    },
});
