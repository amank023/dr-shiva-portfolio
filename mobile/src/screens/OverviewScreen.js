import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Linking,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getAdminStats } from '../services/api';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

export default function OverviewScreen({ onNavigateTab, onOpenNewAppointment }) {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (e) {
      console.warn('Overview stats error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const timer = setInterval(fetchStats, 30000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const counts = stats?.counts || {
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    totalReviews: 5,
    avgRating: '4.8',
    totalMessages: 0,
    unreadMessages: 0,
    totalChatLogs: 0
  };

  const recentApts = stats?.recent?.appointments || [];
  const recentMsgs = stats?.recent?.messages || [];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Admin Control Center"
        subtitle="Dr. Shiva Singh"
        engine={stats?.engine}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            progressBackgroundColor={theme.colors.card}
          />
        }
      >
        {/* Quick Action Clinical Toolbar */}
        <View style={styles.quickBar}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: theme.colors.primary }]}
            onPress={onOpenNewAppointment}
          >
            <Text style={styles.quickBtnIcon}>📅</Text>
            <Text style={styles.quickBtnText}>Book Visit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: '#10b981' }]}
            onPress={() => Linking.openURL('https://wa.me/919889527343')}
          >
            <Text style={styles.quickBtnIcon}>💬</Text>
            <Text style={styles.quickBtnText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: '#0d9488' }]}
            onPress={() => Linking.openURL('https://meet.google.com/new')}
          >
            <Text style={styles.quickBtnIcon}>💻</Text>
            <Text style={styles.quickBtnText}>Meet Room</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.cardBorder }]}
            onPress={() => onNavigateTab('settings')}
          >
            <Text style={styles.quickBtnIcon}>⚙️</Text>
            <Text style={[styles.quickBtnText, { color: theme.colors.text }]}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* KPI Cards Grid */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          PRACTICE PERFORMANCE
        </Text>

        <View style={styles.kpiGrid}>
          <StatCard
            title="Appointments"
            value={counts.totalAppointments}
            subtitle={`${counts.confirmedAppointments || 0} confirmed · ${counts.completedAppointments || 0} completed`}
            icon="🩺"
            color={theme.colors.primary}
            badge={counts.pendingAppointments > 0 ? `${counts.pendingAppointments} pending` : null}
            onPress={() => onNavigateTab('appointments')}
          />

          <StatCard
            title="Patient Feedback"
            value={`${counts.avgRating}★`}
            subtitle={`${counts.totalReviews} verified reviews`}
            icon="⭐"
            color="#f59e0b"
            onPress={() => onNavigateTab('reviews')}
          />

          <StatCard
            title="Inquiries"
            value={counts.totalMessages}
            subtitle={counts.unreadMessages > 0 ? `${counts.unreadMessages} unread inquiries` : 'All caught up'}
            icon="✉️"
            color="#3b82f6"
            badge={counts.unreadMessages > 0 ? `${counts.unreadMessages} new` : null}
            onPress={() => onNavigateTab('messages')}
          />

          <StatCard
            title="24/7 Virtual Bot"
            value={counts.totalChatLogs}
            subtitle="Automated patient interactions"
            icon="🤖"
            color="#10b981"
            onPress={() => onNavigateTab('chatlogs')}
          />
        </View>

        {/* Recent Appointments Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary, marginBottom: 0 }]}>
            RECENT CONSULTATIONS
          </Text>
          <TouchableOpacity onPress={() => onNavigateTab('appointments')}>
            <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '700' }}>
              View All ({counts.totalAppointments}) →
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 20 }} />
        ) : recentApts.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
            <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>No recent consultations booked yet.</Text>
          </View>
        ) : (
          recentApts.map(apt => (
            <TouchableOpacity
              key={apt.id || apt.apt_id}
              style={[styles.itemCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}
              onPress={() => onNavigateTab('appointments')}
            >
              <View style={styles.itemTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemName, { color: theme.colors.text }]}>{apt.name}</Text>
                  <Text style={[styles.itemMeta, { color: theme.colors.textMuted }]}>
                    {apt.phone} {apt.age ? `· ${apt.age} yrs` : ''} {apt.type ? `· ${apt.type}` : ''}
                  </Text>
                </View>
                <StatusBadge status={apt.status} />
              </View>
              <View style={styles.itemBottom}>
                <Text style={[styles.itemTime, { color: theme.colors.primary }]}>
                  📅 {apt.date} at {apt.time_slot}
                </Text>
                {apt.phone ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${apt.phone}`)}
                    style={[styles.smallCallBtn, { backgroundColor: theme.colors.primaryLight }]}
                  >
                    <Text style={{ color: theme.colors.primary, fontSize: 11, fontWeight: '700' }}>Call 📞</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Recent Messages Section */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary, marginBottom: 0 }]}>
            LATEST INQUIRIES
          </Text>
          <TouchableOpacity onPress={() => onNavigateTab('messages')}>
            <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '700' }}>
              Inbox ({counts.totalMessages}) →
            </Text>
          </TouchableOpacity>
        </View>

        {recentMsgs.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
            <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>No incoming inquiries.</Text>
          </View>
        ) : (
          recentMsgs.map(msg => (
            <TouchableOpacity
              key={msg.id}
              style={[
                styles.itemCard,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: msg.read ? theme.colors.cardBorder : theme.colors.primary
                }
              ]}
              onPress={() => onNavigateTab('messages')}
            >
              <View style={styles.itemTop}>
                <Text style={[styles.itemName, { color: theme.colors.text }]}>{msg.name}</Text>
                {!msg.read && (
                  <View style={[styles.unreadDot, { backgroundColor: theme.colors.danger }]} />
                )}
              </View>
              <Text numberOfLines={1} style={[styles.msgSubject, { color: theme.colors.textSecondary }]}>
                {msg.subject || 'Consultation inquiry'}
              </Text>
              <Text numberOfLines={2} style={[styles.msgBody, { color: theme.colors.textMuted }]}>
                {msg.message}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  quickBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickBtnIcon: { fontSize: 18, marginBottom: 2 },
  quickBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12
  },
  kpiGrid: {
    marginBottom: 10
  },
  emptyBox: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 10
  },
  itemCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700'
  },
  itemMeta: {
    fontSize: 11,
    marginTop: 2
  },
  itemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6
  },
  itemTime: {
    fontSize: 12,
    fontWeight: '600'
  },
  smallCallBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  msgSubject: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2
  },
  msgBody: {
    fontSize: 11
  }
});
