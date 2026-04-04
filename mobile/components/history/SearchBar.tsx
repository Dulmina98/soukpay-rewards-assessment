import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Fonts } from '@/constants/fonts';

type SearchBarProps = {
    value: string;
    onChange: (t: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <View style={styles.searchRow}>
            <View style={styles.searchBox}>
                <MaterialCommunityIcons name="magnify" size={20} color="#767684" style={{ marginRight: 8 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search History"
                    placeholderTextColor="#767684"
                    value={value}
                    onChangeText={onChange}
                />
            </View>
            <TouchableOpacity style={styles.filterBtn}>
                <MaterialIcons name="filter-list" size={20} color="#00003C" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 24,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECEAF4',
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#00003C',
        fontFamily: Fonts.inter.regular,
        paddingVertical: 4
    },
    filterBtn: {
        width: 46,
        height: 46,
        borderRadius: 999,
        backgroundColor: '#ECEAF4',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
