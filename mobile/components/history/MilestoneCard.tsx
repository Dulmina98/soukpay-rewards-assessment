import {Image, StyleSheet, Text, View} from 'react-native';
import {Fonts} from '@/constants/fonts';
import MilestoneStar from '@/assets/icons/history/milestone-star.png';

export function MilestoneCard({
                                  title,
                                  description,
                                  amount,
                              }: {
    title: string;
    description: string;
    amount: number;
}) {
    return (
        <View style={styles.card}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>MILESTONE REACHED</Text>
            </View>
            <Image
                source={MilestoneStar}
                style={styles.image}
            />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.amount}>
                + ${amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        position: "relative"
    },
    badge: {
        backgroundColor: '#FCD400',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom:  12,
    },
    badgeText: {
        color: '#00003C',
        fontSize: 10,
        fontFamily: Fonts.inter.semiBold,
    },
    image: {
      width: 56,
        height: 56,
        opacity: 0.2,
        position: "absolute",
        right: 20,
        top: 20
    },
    title: {
        color: '#1B1B22',
        fontSize: 18,
        fontFamily: Fonts.manrope.bold,
        marginBottom: 6,
    },
    description: {
        color: '#767684',
        fontSize: 14,
        fontFamily: Fonts.inter.regular,
        marginBottom: 16,
    },
    amount: {
        color: '#2E7D32',
        fontSize: 24,
        fontFamily: Fonts.manrope.extraBold,
        letterSpacing: -0.6,
    },
});