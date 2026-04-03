import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import LuxurySafari from '@/assets/images/home/Luxury-Safari.jpg';
import {Fonts} from '@/constants/fonts';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export function PromoCard({onPress}: { onPress?: () => void }) {
    return (
        <View style={styles.card}>

            <View style={styles.textSection}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>PLATINUM EXCLUSIVE</Text>
                </View>
                <Text style={styles.title}>Unlock the Safari Collection.</Text>
                <Text style={styles.description}>
                    Use 5,000 points to access curated travel experiences across Sub-Saharan Africa.
                </Text>

                <TouchableOpacity onPress={onPress} style={styles.ctaRow}>
                    <Text style={styles.ctaText}>Explore Collection</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#00003C" style={styles.ctaIcon}/>
                </TouchableOpacity>
            </View>

            <Image
                source={LuxurySafari}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#EAE7F0',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 32,
    },
    textSection: {
        padding: 36,
        paddingBottom: 20,
    },
    badge: {
        backgroundColor: '#00003C',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 16,
    },
    badgeText: {
        color: '#FCD400',
        fontSize: 10,
        fontFamily: Fonts.inter.semiBold,
        letterSpacing: 1,
    },
    title: {
        color: '#00003C',
        fontSize: 30,
        fontFamily: Fonts.manrope.extraBold,
        letterSpacing: -0.75,
        marginBottom: 15,
        lineHeight: 30,
    },
    description: {
        color: '#464653',
        fontSize: 14,
        fontFamily: Fonts.inter.regular,
        lineHeight: 22.8,
        marginBottom: 16,
    },
    ctaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ctaText: {
        color: '#00003C',
        fontSize: 16,
        fontFamily: Fonts.manrope.bold,
    },
    ctaIcon: {
        marginLeft: 6,
    },
    image: {
        width: '100%',
        height: 192,
    },
});