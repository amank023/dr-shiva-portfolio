import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function StatCard({ title, value, subtitle, icon, color, badge, onPress }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder
        }
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: theme.colors.textMuted }]}>
          {title.toUpperCase()}
        </Text>
        <View style={[styles.iconBox, { backgroundColor: color ? `${color}18` : theme.colors.primaryLight }]}>
          <Text style={{ fontSize: 16 }}>{icon || '📊'}</Text>
        </View>
      </View>

      <View style={styles.midRow}>
        <Text style={[styles.value, { color: color || theme.colors.text }]}>
          {value ?? 0}
        </Text>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: theme.colors.warningLight }]}>
            <Text style={[styles.badgeText, { color: theme.colors.warning }]}>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>

      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  midRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 12
  }
});
