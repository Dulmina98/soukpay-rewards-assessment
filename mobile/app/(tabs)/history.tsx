import { useEffect, useCallback, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTransactions, resetTransactions } from '@/store/slices/transactionsSlice';
import { Header } from '@/components/Header';
import { TransactionRow } from '@/components/home/TransactionRow';
import { UpdatingLedger } from '@/components/history/UpdatingLedger';
import { PortfolioCard } from '@/components/history/PortfolioCard';
import { SearchBar } from '@/components/history/SearchBar';
import { Fonts } from '@/constants/fonts';

export default function HistoryScreen() {
    const dispatch = useAppDispatch();
    const { items, page, hasMore, isLoading, isRefreshing, error } =
        useAppSelector((state) => state.transactions);
    const { balance } = useAppSelector((state) => state.user);

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

    const currentMonth = new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    }).toUpperCase();

    const renderFooter = () => {
        if (!isLoading || isRefreshing) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator color="#00003C" />
            </View>
        );
    };

    if (error) {
        return (
            <SafeAreaView style={styles.safe}>
                <Header />
                <View style={styles.center}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <Header />
            <View style={{backgroundColor: '#FBF8FF'}}>
                {showRefreshing && <UpdatingLedger />}
            </View>
            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TransactionRow item={item} />}
                extraData={isRefreshing}
                ListHeaderComponent={
                    <>
                        <PortfolioCard balance={balance} />
                        <SearchBar value={search} onChange={setSearch} />
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
        flex: 1,
        backgroundColor: '#FFF'
    },
    container: {
        flex: 1,
        backgroundColor: '#FBF8FF'
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 32
    },
    footer: {
        padding: 16,
        alignItems: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32
    },
    errorText: {
        color: '#f87171',
        textAlign: 'center'
    },
    emptyText: {
        color: '#666',
        textAlign: 'center'
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
        fontFamily: Fonts.inter.regular,
        letterSpacing: 1.2,
    },
});
