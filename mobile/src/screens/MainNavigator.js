import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getAdminStats } from '../services/api';

import OverviewScreen from './OverviewScreen';
import AppointmentsScreen from './AppointmentsScreen';
import MessagesScreen from './MessagesScreen';
import ReviewsScreen from './ReviewsScreen';
import ChatLogsScreen from './ChatLogsScreen';
import ContentScreen from './ContentScreen';
import SettingsScreen from './SettingsScreen';

const TABS = [
  { key: 'overview', label: 'Overview', icon: '🩺' },
  { key: 'appointments', label: 'Visits', icon: '📅', badgeKey: 'pendingAppointments' },
  { key: 'messages', label: 'Inbox', icon: '✉️', badgeKey: 'unreadMessages' },
  { key: 'reviews', label: 'Reviews', icon: '⭐' },
  { key: 'chatlogs', label: 'Bot Logs', icon: '🤖' },
  { key: 'content', label: 'CMS', icon: '📝' },
  { key: 'settings', label: 'Settings', icon: '⚙️' }
];

export default function MainNavigator() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [counts, setCounts] = useState({
    pendingAppointments: 0,
    unreadMessages: 0
  });

  // Flag to automatically trigger appointment modal if user tapped quick action
  const [openNewAppointmentModal, setOpenNewAppointmentModal] = useState(false);

  const fetchBadges = async () => {
    try {
      const stats = await getAdminStats();
      if (stats?.counts) {
        setCounts({
          pendingAppointments: stats.counts.pendingAppointments || 0,
          unreadMessages: stats.counts.unreadMessages || 0
        });
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchBadges();
    const interval = setInterval(fetchBadges, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigateTab = (tabKey) => {
    setActiveTab(tabKey);
  };

  const handleQuickNewAppointment = () => {
    setActiveTab('appointments');
    setOpenNewAppointmentModal(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.contentContainer}>
        {activeTab === 'overview' && (
          <OverviewScreen
            onNavigateTab={handleNavigateTab}
            onOpenNewAppointment={handleQuickNewAppointment}
          />
        )}
        {activeTab === 'appointments' && (
          <AppointmentsScreen
            initialOpenModal={openNewAppointmentModal}
          />
        )}
        {activeTab === 'messages' && <MessagesScreen />}
        {activeTab === 'reviews' && <ReviewsScreen />}
        {activeTab === 'chatlogs' && <ChatLogsScreen />}
        {activeTab === 'content' && <ContentScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </View>

      {/* Persistent Bottom Tab Navigation Bar */}
      <View
        style={[
          styles.tabBarWrapper,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border
          }
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContainer}
        >
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            const badgeCount = tab.badgeKey ? counts[tab.badgeKey] : 0;

            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabItem,
                  isActive && {
                    backgroundColor: theme.colors.primaryLight,
                    borderRadius: 14
                  }
                ]}
                onPress={() => {
                  if (tab.key !== 'appointments') setOpenNewAppointmentModal(false);
                  setActiveTab(tab.key);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.iconWrapper}>
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  {badgeCount > 0 && (
                    <View style={styles.badgePill}>
                      <Text style={styles.badgePillText}>
                        {badgeCount > 9 ? '9+' : badgeCount}
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? theme.colors.primary : theme.colors.textMuted,
                      fontWeight: isActive ? '700' : '500'
                    }
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
                {isActive && (
                  <View style={[styles.activeIndicator, { backgroundColor: theme.colors.primary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 24 : 0
  },
  contentContainer: {
    flex: 1
  },
  tabBarWrapper: {
    borderTopWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8
  },
  tabScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 62
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2
  },
  badgePill: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  badgePillText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800'
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2
  },
  activeIndicator: {
    width: 14,
    height: 3,
    borderRadius: 2,
    marginTop: 3
  }
});