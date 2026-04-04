import {ScrollView, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Fonts} from '@/constants/fonts';

export const CATEGORIES = ['All Rewards', 'Food & Drink', 'Entertainment', 'Shopping', 'Membership'];

export function CategoryTabs({selected, onSelect}: {
    selected: string;
    onSelect: (cat: string) => void;
}) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}
            contentContainerStyle={styles.tabsContent}
        >
            {CATEGORIES.map((cat) => (
                <TouchableOpacity
                    key={cat}
                    style={[styles.tab, selected === cat && styles.tabActive]}
                    onPress={() => onSelect(cat)}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.tabText, selected === cat && styles.tabTextActive]}>
                        {cat}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    tabsScroll: {
        marginBottom: 16,
    },
    tabsContent: {
        paddingHorizontal: 20,
        gap: 8,
    },
    tab: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 999,
        backgroundColor: '#F5F2FC',
    },
    tabActive: {
        backgroundColor: '#00003C',
    },
    tabText: {
        color: '#464653',
        fontSize: 14,
        fontFamily: Fonts.inter.semiBold,
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
});
