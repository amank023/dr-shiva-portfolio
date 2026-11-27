import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const doctorAvatar = require('../../assets/doctor.jpg');

export default function Header({ title, subtitle, engine = 'firebase-firestore' }) {
  const { theme, isDark } = useTheme();

  const isFirestore = engine === 'firebase-firestore' || engine === 'Firebase Firestore (Cloud)';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.headerBg, borderColor: theme.colors.cardBorder }]}>
      <View style={styles.leftRow}>
        <View style={[styles.avatarBox, { borderColor: theme.colors.primary }]}>
          <Image
            source={doctorAvatar}
            style={styles.avatarImage}
            resizeMode="cover"
          />
          <View style={[styles.onlineDot, { borderColor: theme.colors.headerBg }]} />
        </View>

        <View style={styles.titleCol}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
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
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
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
    marginRight: 12,
    position: 'relative',
    borderWidth: 1.5,
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%'
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2
  },
  titleCol: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
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
    fontSize: 11,
    fontWeight: '500',
    flex: 1
  }
});
