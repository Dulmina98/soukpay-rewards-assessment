import { useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile, fetchRecentTransactions } from '@/store/slices/userSlice';
import { logoutUser } from '@/store/slices/authSlice';
import { Fonts } from '@/constants/fonts';
import { TransactionRow } from '@/components/home/TransactionRow';
import { AnimatedBalance } from '@/components/home/AnimatedBalance';
import { Header } from '@/components/Header';

export default function HomeScreen() {
    const dispatch = useAppDispatch();
    const { name, balance, recentTransactions, isLoading } =
        useAppSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUserProfile());
        dispatch(fetchRecentTransactions());
    }, []);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <SafeAreaView style={styles.safe}>
            <Header showWelcome />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
            >
                {/*<View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome back,</Text>
                        <Text style={styles.name}>{name || '...'}</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>*/}

                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Current Assets</Text>
                    <AnimatedBalance balance={balance} />
                    <Text style={styles.balanceSub}>Vault Points Available</Text>

                    <View style={styles.balanceFooter}>
                        <View style={styles.avatarGroup}>
                            <View style={[styles.avatar, styles.avatarGrey]}>
                                <Text style={styles.avatarText}>S</Text>
                            </View>
                            <View style={[styles.avatar, styles.avatarYellow]}>
                                <Text style={styles.avatarStar}>★</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.redeemBtn} onPress={() => {}}>
                            <Text style={styles.redeemText}>Redeem Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Activity Log</Text>
                    <TouchableOpacity>
                        <Text style={styles.sectionTitleBtnText}>View All</Text>
                        <View style={styles.sectionTitleBtnLine} />
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    {isLoading ? (
                        <Text style={styles.loadingText}>Loading...</Text>
                    ) : recentTransactions.length === 0 ? (
                        <Text style={styles.emptyText}>No transactions yet</Text>
                    ) : (
                        recentTransactions.map((tx) => (
                            <TransactionRow key={tx.id} item={tx} />
                        ))
                    )}
                </View>
            </ScrollView>
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
        backgroundColor: '#FBF8FF'
    },
    content: {
        padding: 24,
        paddingBottom: 80
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 8,
    },
    greeting: { color: '#888', fontSize: 14, fontFamily: Fonts.inter.medium },
    name: { color: '#00003C', fontSize: 22, fontFamily: Fonts.manrope.extraBold },
    logoutBtn: {
        backgroundColor: '#1a1a2e',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    logoutText: { color: '#888', fontSize: 13 },
    balanceCard: {
        backgroundColor: '#00003C',
        borderRadius: 20,
        padding: 28,
        marginBottom: 32,
    },
    balanceLabel: {
        color: '#FFE16D',
        fontSize: 14,
        marginBottom: 8,
        textTransform: 'uppercase',
        fontFamily: Fonts.inter.semiBold,
        letterSpacing: 2.4,
    },
    balanceSub: {
        color: 'rgba(228,225,235,0.8)',
        fontSize: 16,
        marginTop: 4,
        lineHeight: 24,
        fontFamily: Fonts.inter.medium,
    },
    balanceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    avatarGroup: { flexDirection: 'row', alignItems: 'center' },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#00003C',
    },
    avatarGrey: { backgroundColor: '#E4E1EB', zIndex: 1 },
    avatarYellow: { backgroundColor: '#FCD400', marginLeft: -10, zIndex: 2 },
    avatarText: { color: '#00003C', fontSize: 14, fontWeight: '600' },
    avatarStar: { color: '#00003C', fontSize: 14 },
    redeemBtn: {
        backgroundColor: '#FCD400',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    redeemText: { color: '#6E5C00', fontSize: 15, fontWeight: '700' },
    sectionTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        color: '#1B1B22',
        fontSize: 24,
        marginBottom: 16,
        fontFamily: Fonts.manrope.extraBold,
        letterSpacing: -0.6,
    },
    sectionTitleBtnText: {
        textTransform: 'uppercase',
        color: '#00003C',
        letterSpacing: 1.2,
        fontSize: 12,
        fontFamily: Fonts.inter.semiBold,
    },
    sectionTitleBtnLine: {
        height: 2,
        width: '100%',
        backgroundColor: '#FCD400',
        marginTop: 4,
    },
    section: { borderRadius: 16, padding: 0 },
    loadingText: { color: '#666', textAlign: 'center', padding: 16 },
    emptyText: { color: '#666', textAlign: 'center', padding: 16 },
});
