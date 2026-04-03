import { Tabs } from 'expo-router';
import { SvgProps } from 'react-native-svg';

import HomeIcon from '../../assets/icons/tab-bar/home.svg';
import HomeActiveIcon from '../../assets/icons/tab-bar/home-active.svg';
import RewardsIcon from '../../assets/icons/tab-bar/rewards.svg';
import RewardsActiveIcon from '../../assets/icons/tab-bar/rewards-active.svg';
import HistoryIcon from '../../assets/icons/tab-bar/history.svg';
import HistoryActiveIcon from '../../assets/icons/tab-bar/history-active.svg';

type TabIconProps = {
    focused: boolean;
    Icon: React.FC<SvgProps>;
    ActiveIcon: React.FC<SvgProps>;
};

function TabIcon({ focused, Icon, ActiveIcon }: TabIconProps) {
    const Component = focused ? ActiveIcon : Icon;
    return <Component width={24} height={24} />;
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0a0a1a',
                    borderTopColor: '#333',
                },
                tabBarActiveTintColor: '#6c47ff',
                tabBarInactiveTintColor: '#666',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={HomeIcon}
                            ActiveIcon={HomeActiveIcon}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="rewards"
                options={{
                    title: 'Rewards',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={RewardsIcon}
                            ActiveIcon={RewardsActiveIcon}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={HistoryIcon}
                            ActiveIcon={HistoryActiveIcon}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}