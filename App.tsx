
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './app/screens/HomeScreen';
import WorkoutsScreen from './app/screens/WorkoutsScreen';
import LenzAnalysisScreen from './app/screens/LenzAnalysisScreen';
import CommunityScreen from './app/screens/CommunityScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import ProgressScreen from './app/screens/ProgressScreen';

const Tab = createBottomTabNavigator();

const theme = {
  colors: {
    primary: '#4F8EF7',
    background: '#181A20',
    card: '#23272F',
    text: '#fff',
    border: '#23272F',
    notification: '#FF6F61',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: theme.colors.card },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Workouts" component={WorkoutsScreen} />
        <Tab.Screen name="Lenz Analysis" component={LenzAnalysisScreen} />
        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
