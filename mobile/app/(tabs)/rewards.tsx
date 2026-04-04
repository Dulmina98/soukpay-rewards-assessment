import {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {fetchRewards, redeemReward, clearRedeemError, decrementStock} from '@/store/slices/rewardsSlice';
import type {Reward} from '@/store/slices/rewardsSlice';
import {fetchUserProfile, fetchRecentTransactions, deductBalance} from '@/store/slices/userSlice';
import {fetchTransactions, resetTransactions} from '@/store/slices/transactionsSlice';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Fonts} from '@/constants/fonts';
import {Header} from '@/components/Header';
import {BalanceHeader} from '@/components/rewards/BalanceHeader';
import {CategoryTabs, CATEGORIES} from '@/components/rewards/CategoryTabs';
import {RewardCard} from '@/components/rewards/RewardCard';
import {RedeemModal} from '@/components/rewards/RedeemModal';
import {useNetworkStatus} from '@/hooks/useNetworkStatus';

export default function RewardsScreen() {
    const dispatch = useAppDispatch();
    const {rewards, isLoading, isRedeeming, redeemError} =
        useAppSelector((state) => state.rewards);
    const {balance} = useAppSelector((state) => state.user);

    const isOnline = useNetworkStatus();

    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

    useEffect(() => {
        dispatch(fetchRewards());
    }, []);

    const filteredRewards = activeCategory === CATEGORIES[0]
        ? rewards
        : rewards.filter((r) => r.category === activeCategory);

    const handleCardPress = useCallback((reward: Reward) => {
        setSelectedReward(reward);
        dispatch(clearRedeemError());
        setModalVisible(true);
    }, []);

    const handleConfirmRedeem = async () => {
        if (!selectedReward) return;
        const idempotencyKey = uuidv4();
        dispatch(deductBalance(selectedReward.points_cost));
        dispatch(decrementStock(selectedReward.id));

        const result = await dispatch(
            redeemReward({rewardId: selectedReward.id, idempotencyKey})
        );

        if (redeemReward.fulfilled.match(result)) {
            setModalVisible(false);
            Alert.alert('🎉 Redeemed!', `You successfully redeemed ${selectedReward.name}`, [{text: 'OK'}]);
            dispatch(fetchUserProfile());
            dispatch(fetchRecentTransactions());
            dispatch(resetTransactions());
            dispatch(fetchTransactions(1));
        } else {
            dispatch(deductBalance(-selectedReward.points_cost));
            dispatch(fetchRewards());
        }
    };

    const handleCloseModal = () => {
        if (!isRedeeming) {
            setModalVisible(false);
            dispatch(clearRedeemError());
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safe}>
                <Header/>
                <View style={styles.center}>
                    <ActivityIndicator color="#00003C" size="large"/>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <Header/>
            <FlatList
                data={filteredRewards}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <RewardCard
                        item={item}
                        userBalance={balance}
                        onPress={handleCardPress}
                        isOnline={isOnline}
                    />
                )}
                ListHeaderComponent={
                    <>
                        <BalanceHeader balance={balance}/>
                        <CategoryTabs
                            selected={activeCategory}
                            onSelect={setActiveCategory}
                        />
                    </>
                }
                contentContainerStyle={styles.list}
                style={styles.container}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <MaterialCommunityIcons name="gift-off-outline" size={48} color="#ccc"/>
                        <Text style={styles.emptyText}>No rewards available</Text>
                    </View>
                }
            />

            <RedeemModal
                reward={selectedReward}
                visible={modalVisible}
                isRedeeming={isRedeeming}
                error={redeemError}
                isOnline={isOnline}
                onConfirm={handleConfirmRedeem}
                onClose={handleCloseModal}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        height: Dimensions.get('window').height,
        backgroundColor: '#FFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FBF8FF',
    },
    list: {
        paddingBottom: 80,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        gap: 12,
    },
    emptyText: {
        color: '#aaa',
        fontSize: 15,
        fontFamily: Fonts.inter.medium,
    },
});
