import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fonts } from '@/constants/fonts';

export function PortfolioCard({ balance }: { balance: number }) {
    return (
        <View style={styles.portfolioCard}>
            <Text style={styles.portfolioLabel}>PORTFOLIO VALUE</Text>
            <Text style={styles.portfolioAmount}>
                <Text style={styles.portfolioDollar}>$ </Text>
                {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <View style={styles.portfolioBadge}>
                <MaterialCommunityIcons name="trending-up" size={14} color="#FFE16D" />
                <Text style={styles.portfolioBadgeText}> +12.4%</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    portfolioCard: {
        backgroundColor: '#00003C',
        borderRadius: 12,
        padding: 32,
        marginTop: 8,
        marginBottom: 16,
    },
    portfolioLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontFamily: Fonts.inter.regular,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    portfolioAmount: {
        color: '#fff',
        fontSize: 36,
        fontFamily: Fonts.manrope.extraBold,
        letterSpacing: -0.9,
        marginBottom: 16,
    },
    portfolioDollar: {
        color: '#FCD400',
        fontSize: 24,
        fontFamily: Fonts.manrope.bold,
    },
    portfolioBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    portfolioBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: Fonts.inter.medium,
    },
});
