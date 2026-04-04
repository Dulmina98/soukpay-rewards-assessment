import {Tabs} from 'expo-router';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

import HomeIcon from '../../assets/icons/tab-bar/home.svg';
import HomeActiveIcon from '../../assets/icons/tab-bar/home-active.svg';
import RewardsIcon from '../../assets/icons/tab-bar/rewards.svg';
import RewardsActiveIcon from '../../assets/icons/tab-bar/rewards-active.svg';
import HistoryIcon from '../../assets/icons/tab-bar/history.svg';
import HistoryActiveIcon from '../../assets/icons/tab-bar/history-active.svg';
import {Fonts} from "@/constants/fonts";

const TABS = [
    {name: 'index', label: 'HOME', Icon: HomeIcon, ActiveIcon: HomeActiveIcon},
    {name: 'history', label: 'HISTORY', Icon: HistoryIcon, ActiveIcon: HistoryActiveIcon},
    {name: 'rewards', label: 'REWARDS', Icon: RewardsIcon, ActiveIcon: RewardsActiveIcon},
];

function CustomTabBar({state, navigation}: BottomTabBarProps) {
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const tab = TABS.find(t => t.name === route.name);
                if (!tab) return null;

                const focused = state.index === index;
                const Icon = focused ? tab.ActiveIcon : tab.Icon;

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={() => navigation.navigate(route.name)}
                        style={styles.tabItem}
                        activeOpacity={0.8}
                    >
                        {focused ? (
                            <View style={[styles.iconWrapper, styles.iconWrapperActive]}>
                                <Icon width={24} height={24}/>
                                <Text style={styles.labelActive}>{tab.label}</Text>
                            </View>
                        ) : (
                            <>
                                <Icon width={24} height={24}/>
                                <Text style={styles.label}>{tab.label}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 28,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E2E8F0',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        flexDirection: 'column',
    },
    iconWrapper: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapperActive: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        alignItems: 'center',
        gap: 2,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        color: '#64748B',
        letterSpacing: 1,
        marginTop: 4,
        fontFamily: Fonts.inter.medium
    },
    labelActive: {
        fontSize: 10,
        fontWeight: '700',
        color: '#00003C',
        letterSpacing: 1,
        fontFamily: Fonts.inter.medium,
        marginTop: 2
    },
});

export default function TabsLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{headerShown: false}}
        >
            <Tabs.Screen name="index"/>
            <Tabs.Screen name="history"/>
            <Tabs.Screen name="rewards"/>
        </Tabs>
    );
}