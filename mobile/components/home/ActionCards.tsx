import {MaterialCommunityIcons} from '@expo/vector-icons';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Fonts} from '@/constants/fonts';

function ActionCard({
                        iconName,
                        iconColor,
                        iconBg,
                        title,
                        subtitle,
                        onPress,
                        variant = 'primary',
                    }: {
    iconName: any;
    iconColor: string;
    iconBg: string;
    title: string;
    subtitle: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary';
}) {
    return (
        <TouchableOpacity
            style={[
                styles.card,
                variant === "secondary" && { backgroundColor: '#F5F2FC' }
            ]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <View style={[styles.iconCircle, {backgroundColor: iconBg}]}>
                <MaterialCommunityIcons name={iconName} size={20} color={iconColor}/>
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </TouchableOpacity>
    );
}

export function ActionCards() {
    return (
        <View style={styles.row}>
            <ActionCard
                iconName="send-outline"
                iconColor="#000080"
                iconBg="rgba(0,0,128,0.2)"
                title={'Transfer\nPoints'}
                subtitle="Send to partners"
                onPress={() => {
                }}
            />
            <ActionCard
                iconName="credit-card-plus-outline"
                iconColor="#705D00"
                iconBg="rgba(252,212,0,0.2)"
                title={'Boost\nEarnings'}
                subtitle="Active multipliers"
                onPress={() => {
                }}
                variant={'secondary'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'flex-start',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    cardTitle: {
        color: '#1B1B22',
        fontSize: 18,
        fontFamily: Fonts.manrope.bold,
        lineHeight: 22.5,
        marginBottom: 8,
    },
    cardSubtitle: {
        color: '#464653',
        fontSize: 12,
        fontFamily: Fonts.inter.regular,
    },
});