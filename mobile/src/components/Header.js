import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Header({ title, subtitle, engine = 'firebase-firestore', onRefresh, isRefreshing }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const isFirestore = engine === 'firebase-firestore' || engine === 'Firebase Firestore (Cloud)';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.headerBg, borderColor: theme.colors.cardBorder }]}>
      <View style={styles.leftRow}>
        <View style={[styles.avatarBox, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>⚕️</Text>
        </View>
        <View style={styles.titleCol}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title || 'Dr. Shiva Singh'}
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.engineBadge, {
              backgroundColor: isFirestore
                ? (isDark ? '#451a03' : '#fef3c7')
                : (isDark ? '#0c2b45' : '#e0f2fe'),
              borderColor: isFirestore ? '#f59e0b' : '#38bdf8'
            }]}>
              <Text style={[styles.engineText, {
                color: isFirestore
                  ? (isDark ? '#fbbf24' : '#b45309')
                  : (isDark ? '#38bdf8' : '#0369a1')
              }]}>
                {isFirestore ? '🔥 Firestore' : '📁 LowDB'}
              </Text>
            </View>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.rightActions}>
        {onRefresh ? (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.colors.badgeBg, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={onRefresh}
            disabled={isRefreshing}
          >
            <Text style={{ fontSize: 16 }}>{isRefreshing ? '⏳' : '🔄'}</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.colors.badgeBg, borderColor: theme.colors.border, borderWidth: 1 }]}
          onPress={toggleTheme}
        >
          <Text style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  avatarText: {
    fontSize: 22
  },
  titleCol: {
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6
  },
  engineBadge: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 0.8
  },
  engineText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  subtitle: {
    fontSize: 11
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
