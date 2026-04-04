import {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, FlatList, RefreshControl, StyleSheet, Text, View,} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {fetchTransactions, resetTransactions} from '@/store/slices/transactionsSlice';
import {Header} from '@/components/Header';
import {TransactionRow} from '@/components/home/TransactionRow';
import {Fonts} from '@/constants/fonts';
import {PortfolioCard} from '@/components/history/PortfolioCard';
import {SearchBar} from '@/components/history/SearchBar';
import {MilestoneCard} from '@/components/history/MilestoneCard';
import {UpdatingLedger} from '@/components/history/UpdatingLedger';


type ListItem =
    | {type: 'transaction'; data: any}
    | {type: 'milestone'; title: string; description: string; amount: number};

function PulseDot({delay}: {delay: number}) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const anim = Animated.loop(
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
        );
        anim.start();
        return () => anim.stop();
    }, []);

    return <Animated.View style={[styles.dot, {opacity}]}/>;
}

function LoadingOlderEntries() {
    return (
        <View style={styles.loadingOlderContainer}>
            <View style={styles.dotsRow}>
                <PulseDot delay={0}/>
                <PulseDot delay={200}/>
                <PulseDot delay={400}/>
            </View>
            <Text style={styles.loadingOlderText}>LOADING OLDER ENTRIES</Text>
        </View>
    );
}

export default function HistoryScreen() {
    const dispatch = useAppDispatch();
    const {items, page, hasMore, isLoading, isRefreshing, error} =
        useAppSelector((state) => state.transactions);
    const {balance} = useAppSelector((state) => state.user);

    const [search, setSearch] = useState('');
    const [showRefreshing, setShowRefreshing] = useState(false);
    const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        dispatch(fetchTransactions(1));
    }, []);

    useEffect(() => {
        if (!isRefreshing && showRefreshing) {
            refreshTimer.current = setTimeout(() => setShowRefreshing(false), 1500);
        }
        return () => {
            if (refreshTimer.current) clearTimeout(refreshTimer.current);
        };
    }, [isRefreshing]);

    const handleRefresh = useCallback(() => {
        setShowRefreshing(true);
        dispatch(resetTransactions());
        dispatch(fetchTransactions(1));
    }, []);

    const handleLoadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            dispatch(fetchTransactions(page + 1));
        }
    }, [isLoading, hasMore, page]);

    const filteredItems = items.filter(item =>
        item.reason.toLowerCase().includes(search.toLowerCase())
    );

    const listData: ListItem[] = filteredItems.map(item => ({
        type: 'transaction',
        data: item,
    }));

    if (listData.length >= 4) {
        listData.splice(4, 0, {
            type: 'milestone',
            title: 'Referral Platinum Bonus',
            description: '5 users successfully onboarded',
            amount: 500,
        });
    }

    const currentMonth = new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    }).toUpperCase();

    const renderItem = ({item}: {item: ListItem}) => {
        if (item.type === 'milestone') {
            return (
                <MilestoneCard
                    title={item.title}
                    description={item.description}
                    amount={item.amount}
                />
            );
        }
        return <TransactionRow item={item.data}/>;
    };

    const renderFooter = () => {
        if (!hasMore) return null;
        return <LoadingOlderEntries/>;
    };

    if (error) {
        return (
            <SafeAreaView style={styles.safe}>
                <Header/>
                <View style={styles.center}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <Header/>
            {showRefreshing && (
                <View style={styles.updatingWrapper}>
                    <UpdatingLedger/>
                </View>
            )}
            <FlatList
                data={listData}
                keyExtractor={(item, index) =>
                    item.type === 'transaction' ? item.data.id : `milestone-${index}`
                }
                renderItem={renderItem}
                extraData={isRefreshing}
                ListHeaderComponent={
                    <>
                        <PortfolioCard balance={balance}/>
                        <SearchBar value={search} onChange={setSearch}/>
                        <View style={styles.activityHeader}>
                            <Text style={styles.activityTitle}>Recent Activity</Text>
                            <Text style={styles.activityMonth}>{currentMonth}</Text>
                        </View>
                    </>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={showRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="transparent"
                        colors={['transparent']}
                        progressBackgroundColor="transparent"
                        progressViewOffset={-100}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    !isRefreshing ? (
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No transactions yet</Text>
                        </View>
                    ) : null
                }
                contentContainerStyle={styles.list}
                style={styles.container}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        height: Dimensions.get('window').height,
        backgroundColor: '#FBF8FF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FBF8FF',
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    activityTitle: {
        color: '#1B1B22',
        fontSize: 20,
        fontFamily: Fonts.manrope.extraBold,
        letterSpacing: -0.5,
    },
    activityMonth: {
        color: '#767684',
        fontSize: 12,
        fontFamily: Fonts.inter.semiBold,
        letterSpacing: 1.2,
    },
    loadingOlderContainer: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 12,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 4,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 4,
        backgroundColor: '#00003C',
    },
    loadingOlderText: {
        color: '#767684',
        fontSize: 10,
        fontFamily: Fonts.inter.regular,
        letterSpacing: 3,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    errorText: {
        color: '#f87171',
        textAlign: 'center',
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
    },
});